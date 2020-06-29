import { Lick } from "../entity/lick";
import AudioData from "./audioData";

import shell from "shelljs";
import path from "path";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile); // necessary because async readFile seems to be unavailable for some reason

const crepeOutputDirectory: string = "crepe";

export async function getAudioData(lick: Lick): Promise<AudioData> {
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
