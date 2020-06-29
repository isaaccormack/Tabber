import { Lick } from "../entity/lick";
import shell from "shelljs";
import path from "path";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile); // necessary because async readFile seems to be unavailable for some reason

const crepeOutputDirectory: string = "crepe";

class AudioData {
    time: number[];
    frequency: number[];
    confidence: number[];
    peakAmplitude: number[];
}

class StringFret {
    stringIdx: number; // 1-6 (low-high) (I love numeric variables called string! So clear!)
    fret: number; // 0-12
}

function getNote(pitch: number): number {
    // Convert a pitch to a number between 0 and 127
    // see en.wikipedia.org/wiki/MIDI_tuning_standard#Frequency_values
    return Math.round(69 + 12 * Math.log2(pitch / 440.0));
}

// note is a MIDI-tuning-standard note index, between 0 (C_{-1}) and 127 (G_9).
// Low E on guitar is E_2 (80 Hz, index 40).
// For now, we take the trivial idea that the note is played on the highest-pitched
// string that can play it. We do not take tuning into account (i.e. we assume standard tuning).
// Standard tuning: (string index, note, note index)
// 0 E_4 64
// 1 B_3 59
// 2 G_3 55
// 3 D_3 50
// 4 A_2 45
// 5 E_2 40
//
// see en.wikipedia.org/wiki/Scientific_pitch_notation#Table_of_note_frequencies
// and en.wikipedia.org/wiki/Guitar_tunings#Standard
function getStringAndFret(note: number): StringFret {
    const tuning: number[] = [64, 59, 55, 50, 45, 40]; // Standard tuning
    for (var i = 0; i < tuning.length; ++i) {
        if (note >= tuning[i]) {
            return { stringIdx: i, fret: note - tuning[i] };
        }
    }
    throw new Error("Could not determine string and fret of note (note index: " + note + ")");
}

// Get indices of the passed array which are local maxima
// TODO: improve this to be smoother - only get local maxima which are bigger than multiple prior values
function getLocalMaximaIndices(values: number[]): number[] {
    // handle edge cases
    if (values.length == 0) return [];
    if (values.length == 1) return [0];

    const indices: number[] = [];

    // handle first index being a local maximum
    if (values[0] >= values[1]) {
        indices.push(0);
    }
    // handle middle values being a local maximum
    for (var i = 1; i < values.length - 1; ++i) {
        // use >= for next value in order to get only the first of equal values
        if (values[i] > values[i - 1] && values[i] >= values[i + 1]) {
            indices.push(i);
        }
    }
    // handle last index being a local maximum
    if (values[values.length-1] > values[values.length-2]) {
        indices.push(values.length-1);
    }

    return indices;
}

// For each value in the input array, returns a pair.
// The first element in the pair is the number of prior values which
// the element is larger than or equal to.
// The second element in the pair is the number of subsequent values which
// the element is larger than.
// e.g. with input array [1, 2, 3, 4, 3, 2, 3, 5], the output array is
// [(0, 0), (1, 0), (2, 0), (3, 3), (0, 1), (0, 0), (2, 0), (7, 0)]
// This allows us to have a single function that will work for whatever
// maximum values we need - e.g. if we want to only look at values which
// are the local maximums of an 8-sample region, or which must be larger
// than the 3 prior samples and the 6 subsequent samples, and so forth.
// This implementation is O(n).
function smoothLocalMaxima(values: number[]): any {
    const previousValues: number[] = new Array(values.length);
    const nextValues: number[] = new Array(values.length);
    const stack: number[] = [];

    for (var i = 0; i < values.length; ++i) {
        while (stack.length > 0 && values[stack[stack.length-1]] <= values[i]) {
            const idx = stack.pop();
            nextValues[idx] = i - idx - 1;
        }
        if (stack.length > 0) {
            const idx = stack[stack.length - 1];
            previousValues[i] = i - idx - 1;
        } else {
            previousValues[i] = i - 1;
        }
        stack.push(i);
    }
    while (stack.length > 0) {
        const idx = stack.pop();
        nextValues[idx] = values.length - idx - 1;
    }

    return { prev: previousValues, next: nextValues };
}

// Generates an actual tab string from a sequence of indices which correspond to the times
// at which notes were played, and a sequence of notes (in terms of strings & frets) that
// were played at those times. The lengths of the arrays are equal.
// Generates a tab with 1 horizontal space per 10 samples (i.e. 100 milliseconds). This has
// been arbitrarily picked, but should work okay to start - most people aren't playing 10 notes
// per second, and if they are, it's not clear that we'd be able to tab that correctly anyway.
// The earliest note in each 10-sample interval takes priority if multiple are found.
// NOTE: this fails for frets >= 10 (i.e. it can't deal with 2-digit frets - if one is
//       encountered, it will push the rest of the line to the right by one character.
// NOTE: this generates the whole thing as one single line, so each guitar-string is separated
//       by a newline only at the end. this means that for long tabs, displaying it will get ugly.
function generateTabString(totalSamples: number, peakIndices: number[], peakStringsAndFrets: StringFret[]): string {
    // this is ugly. feel free to clean it up.  We should probably just make the tab-lines, then replace
    // values as necessary.
    const sequenceData: (StringFret|null)[] = new Array(Math.floor(totalSamples / 10)).fill(null);
    for (var i = 0; i < peakIndices.length; ++i) {
        const idx: number = peakIndices[i];
        if (sequenceData[Math.floor(idx / 10)] === null) {
            sequenceData[Math.floor(idx / 10)] = peakStringsAndFrets[i];
        }
    }

    // one data-string per guitar-string. These are joined by newlines after tabbing is complete.
    const stringTabStrings: string[] = new Array(6).fill("|");
    for (var i = 0; i < sequenceData.length; ++i) {
        const stringVal: string[] = new Array(6).fill("-");
        if (sequenceData[i] !== null) {
            stringVal[sequenceData[i].stringIdx] = sequenceData[i].fret.toString();
        }
        stringVal.map((x, idx) => stringTabStrings[idx] += x);
    }

    // End each string with | character
    for (var i = 0; i < stringTabStrings.length; ++i) {
        stringTabStrings[i] += "|";
    }

    return stringTabStrings.join("\n");
}

export default async function tabLick(lick: Lick): Promise<void> {
    console.log("tabbing lick with crepe.");
    console.log(lick);

    const data: AudioData = await getData(lick);

    console.log("final audio data:");
    console.log(data);

    const peakIndices: number[] = getLocalMaximaIndices(data.peakAmplitude);
    const peakFrequencies: number[] = peakIndices.map(idx => data.frequency[idx]);
    const peakNotes: number[] = peakFrequencies.map(freq => getNote(freq));
    const peakStringsAndFrets: StringFret[] = peakNotes.map(note => getStringAndFret(note));
    // 10-millisecond samples
    console.log("Processed audio data:");
    console.log("Time\tIndex\tFrequency\tAmplitude\tNote\tString\tFret")
    for (var i = 0; i < peakIndices.length; ++i) {
        const idx: number = peakIndices[i];
        const str: string = data.time[idx] + "\t"
                            + idx + "\t"
                            + peakFrequencies[i] + "\t\t"
                            + data.peakAmplitude[idx] + "\t"
                            + peakNotes[i] + "\t"
                            + peakStringsAndFrets[i].stringIdx + "\t"
                            + peakStringsAndFrets[i].fret;
        console.log(str);
    }

    const tab: string = generateTabString(data.time.length, peakIndices, peakStringsAndFrets);
    console.log("tab:");
    console.log(tab);

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
