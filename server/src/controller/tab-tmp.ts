import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Context, Request } from "koa";
import { Lick } from "../entity/lick";
import { User } from "../entity/user";
// const fs = require('fs').promises;
const fs = require('fs')
const util = require('util')
// import fs from "fs-promises"

import { Files } from "koa2-formidable";
import shell from "shelljs";
import path from "path";
import parse from "csv-parse/lib/sync";
import { Reader } from "wav";

const crepeOutputDirectory: string = "crepe";
const readFile = util.promisify(fs.readFile);

class AudioData {
    time: number[];
    frequency: number[];
    confidence: number[];
    peakAmplitude: number[];
}

export default async function tabLick(lick: Lick): Promise<void> {
    console.log("tabbing lick with crepe.");
    console.log(lick);

    const data: AudioData = await getData(lick);

    console.log("final audio data:");
    console.log(data);

    console.log("done tabbing lick.");
}

async function getData(lick: Lick): Promise<AudioData> {
    const crepeData: any = await getCrepeOutput(lick);
    const amplitudeData: any = await getAmplitudeData(lick);

    // Workaround for off-by-one errors in current implementation. This way we can fix that issue
    // independently of working with the data. However, once we fix the issues with the amplitude
    // function and crepe function producing inconsistent results (amplitude gives one extra result somehow),
    // this can be removed.
    const numCrepeSamples: number = crepeData.time.length;
    const numAmplitudeSamples: number = amplitudeData.time.length;
    if (numCrepeSamples != numAmplitudeSamples) {
        console.log("CREPE and amplitude calculations produced inconsistent number of samples:"
                    + numCrepeSamples + "," + numAmplitudeSamples);

        // Grab the shorter one
        if (numAmplitudeSamples > numCrepeSamples) {
            amplitudeData.time = amplitudeData.time.slice(0, numCrepeSamples);
            amplitudeData.peakAmplitude = amplitudeData.peakAmplitude.slice(0, numCrepeSamples);
        } else {
            crepeData.time = crepeData.time.slice(0, numAmplitudeSamples);
            crepeData.frequency = crepeData.frequency.slice(0, numAmplitudeSamples);
            crepeData.confidence = crepeData.confidence.slice(0, numAmplitudeSamples);
        }
    }

    const data: AudioData = new AudioData();
    data.time = crepeData.time;
    data.frequency = crepeData.frequency;
    data.confidence = crepeData.confidence;
    data.peakAmplitude = amplitudeData.peakAmplitude;

    return data;
}

async function getCrepeOutput(lick: Lick): Promise<any> {
    // this is absurdly sketchy and insecure. ideally we would transfer crepe
    // to javascript (which is very doable - we just need to use tensorflow for javascript and
    // convert a bunch of scipy/numpy code into js; most crucially we need to find an effective
    // .wav file reader [crepe uses scipy.wavFile.read()] to get data from the audio file for
    // inputting into the tensorflow model).
    console.log("running crepe model");

    const execString: string = "crepe " + "--output " + crepeOutputDirectory + " --model-capacity full " + lick.audioFileLocation;

    console.log("executing string:");
    console.log(execString);

    await shell.exec(execString);

    console.log("crepe output complete for " + lick.audioFileLocation);
    const crepeFilePath: string = crepeOutputDirectory + "/" + path.basename(lick.audioFileLocation)

    console.log("output file: " + crepeFilePath);
    const results: any = await getCrepeCsvData(crepeFilePath);

    return results;
}

async function getAmplitudeData(lick: Lick): Promise<any> {
    // this is pretty sketchy and slow. ideally we transfer this to pure js, or at the very least
    // merge it with crepe's data analysis so that we don't spawn multiple shells and read the file
    // multiple times. if we could find an effective .wav file reader, then this would all be thoroughly
    // doable. (or, if we could modify crepe to take mp3 or other data formats, then a reader for those)
    console.log("getting wav data");

    const amplitudeFilePath: string = crepeOutputDirectory + "/" + path.basename(lick.audioFileLocation) + "-amplitude.csv";
    const execString: string = "python3 crepe/read_wav.py --input " + lick.audioFileLocation + " --output " + amplitudeFilePath;

    console.log("executing string:");
    console.log(execString);

    await shell.exec(execString);

    console.log("amplitude data extraction complete for " + lick.audioFileLocation);

    console.log("output file: " + amplitudeFilePath);
    const results: any = await getAmplitudeCsvData(amplitudeFilePath);

    return results;
}

// Get CREPE output csv data
async function getCrepeCsvData(filePath: string): Promise<any> {
    // Load csv file contents
    const csvFile = await readFile(filePath);

    // Read csv file row-by-row
    // Each row will be an object e.g. {time: '0.240', frequency: '440.034', confidence: '0.887045'}
    const parseResults: any[] = parse(csvFile, {columns: true}); // use first (header) line as labels

    // Rotate csv file to produce three arrays: time[], frequency[], and confidence[].
    const time: Number[] = parseResults.map(x => Number(x.time));
    const frequency: Number[] = parseResults.map(x => Number(x.frequency));
    const confidence: Number[] = parseResults.map(x => Number(x.confidence));

    return {time, frequency, confidence};
}

// Get amplitude output csv data
async function getAmplitudeCsvData(filePath: string): Promise<any> {
    // Load csv file contents
    const csvFile = await readFile(filePath);

    // Read csv file row-by-row
    // Each row will be an object e.g. {time: '0.240', max_amplitude: '358.231005'}
    const parseResults: any[] = parse(csvFile, {columns: true}); // use first (header) line as labels

    // Rotate csv file to produce two arrays: time[] and maxAmplitude[]
    const time: Number[] = parseResults.map(x => Number(x.time));
    const peakAmplitude: Number[] = parseResults.map(x => Number(x.max_amplitude));

    return {time, peakAmplitude};
}

/*
/////////////////////////////////// ml5 example implementation //////////////////////////////////////
// Requires AudioContext from browser plus p5.AudioIn(), which gets the mic from browser.
// Then it passes them to ml5.pitchDetection, which runs on the model folder associated with it.
// Pitch detection is run recursively (i.e. indefinitely) via ml5.pitchDetection().getPitch().
// This is where the example is:
// https://github.com/ml5js/ml5-library/blob/development/examples/p5js/PitchDetection/PitchDetection_Piano/sketch.js
// This is where the actual pitch detection algorithm is:
// https://github.com/ml5js/ml5-library/blob/development/src/PitchDetection/index.js
let pitch;
let audioContext;
let mic;

audioContext = getAudioContext();
mic = new p5.AudioIn();
mic.start(startPitch);

function getPitch() {
    pitch.getPitch(function(err, frequency) {
        getPitch();
    });
}

function startPitch() {
    pitch = ml5.pitchDetection("./model/", audioContext, mic.stream, getPitch);
}

////// actual pitch detection/////////////////////////
import * as tf from '@tensorflow/tfjs';


class PitchDetection {
    /**
     * Create a pitchDetection.
     * @param {Object} model - The path to the trained model. Only CREPE is available for now. Case insensitive.
     * @param {AudioContext} audioContext - The browser audioContext to use.
     * @param {MediaStream} stream  - The media stream to use.
     *
    constructor(model, audioContext, stream) {
        /**
         * The pitch detection model.
         * @type {model}
         * @public
         *
        this.model = model;
        /**
         * The AudioContext instance. Contains sampleRate, currentTime, state, baseLatency.
         * @type {AudioContext}
         * @public
         *
        this.audioContext = audioContext;
        /**
         * The MediaStream instance. Contains an id and a boolean active value.
         * @type {MediaStream}
         * @public
         *
        this.stream = stream;
        this.frequency = null;
        this.ready = this.loadModel(model);
    }

    async loadModel(model) {
        this.model = await tf.loadLayersModel(`${model}/model.json`);
        if (this.audioContext) {
            await this.processStream();
        } else {
            throw new Error('Could not access microphone - getUserMedia not available');
        }
        return this;
    }

    async processStream() {
        await tf.nextFrame();

        const mic = this.audioContext.createMediaStreamSource(this.stream);
        const minBufferSize = (this.audioContext.sampleRate / 16000) * 1024;
        let bufferSize = 4;
        while (bufferSize < minBufferSize) bufferSize *= 2;

        const scriptNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        scriptNode.onaudioprocess = this.processMicrophoneBuffer.bind(this);
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);

        mic.connect(scriptNode);
        scriptNode.connect(gain);
        gain.connect(this.audioContext.destination);

        if (this.audioContext.state !== 'running') {
            console.warn('User gesture needed to start AudioContext, please click');
        }
    }

    async processMicrophoneBuffer(event) {
        await tf.nextFrame();
        /**
         * The current pitch prediction results from the classification model.
         * @type {Object}
         * @public
         *
        this.results = {};

        const resampled = await PitchDetection.resample(event.inputBuffer);
        let r = (resampled) => {
            tf.tidy(() => {
                /**
                 * A boolean value stating whether the model instance is running or not.
                 * @type {boolean}
                 * @public
                 *
                this.running = true;

                const centMapping = tf.add(tf.linspace(0, 7180, 360), tf.tensor(1997.3794084376191));

                const frame = tf.tensor(resampled.slice(0, 1024));
                const zeromean = tf.sub(frame, tf.mean(frame));
                const framestd = tf.tensor(tf.norm(zeromean).dataSync() / Math.sqrt(1024));
                const normalized = tf.div(zeromean, framestd);
                const input = normalized.reshape([1, 1024]);
                const activation = this.model.predict([input]).reshape([360]);
                const confidence = activation.max().dataSync()[0];
                const center = activation.argMax().dataSync()[0];
                this.results.confidence = confidence.toFixed(3);

                const start = Math.max(0, center - 4);
                const end = Math.min(360, center + 5);
                const weights = activation.slice([start], [end - start]);
                const cents = centMapping.slice([start], [end - start]);

                const products = tf.mul(weights, cents);
                const productSum = products.dataSync().reduce((a, b) => a + b, 0);
                const weightSum = weights.dataSync().reduce((a, b) => a + b, 0);
                const predictedCent = productSum / weightSum;
                const predictedHz = 10 * (2 ** (predictedCent / 1200.0));

                const frequency = (confidence > 0.5) ? predictedHz : null;
                this.frequency = frequency;
            });
        });
        r(resampled);
    }

    /**
     * Returns the pitch from the model attempting to predict the pitch.
     * @param {function} callback - Optional. A function to be called when the model has generated content. If no callback is provided, it will return a promise that will be resolved once the model has predicted the pitch.
     * @returns {number}
     *
    async getPitch(callback): Promise<number> {
        await this.ready;
        await tf.nextFrame();
        return this.frequency;
    }

    static resample(audioBuffer) {
        const interpolate = (audioBuffer.sampleRate % 16000 !== 0);
        const multiplier = audioBuffer.sampleRate / 16000;
        const original = audioBuffer.getChannelData(0);
        const subsamples = new Float32Array(1024);
        for (let i = 0; i < 1024; i += 1) {
            if (!interpolate) {
                subsamples[i] = original[i * multiplier];
            } else {
                const left = Math.floor(i * multiplier);
                const right = left + 1;
                const p = (i * multiplier) - left;
                subsamples[i] = (((1 - p) * original[left]) + (p * original[right]));
            }
        }
        return subsamples;
    }
}
*/
