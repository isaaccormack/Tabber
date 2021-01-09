import shell from "shelljs";
import path from "path";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import util from "util";
import PitchData from "./data/pitchData";

// These are necessary because async fs functions are unavailable for some reason
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

// The purpose of this class is to calculate pitch data from an audio file.

export default class PitchDetector {

    // folder, relative to pwd, to store output csv file in.
    // TODO: make this just use a temp folder, if crepe allows.
    private static readonly CrepeOutputDirectory: string = "crepe";

    public static async getPitchData(audioFilePath: string): Promise<PitchData> {
        const crepeFilePath: string = await PitchDetector.runCrepe(audioFilePath);
        const results: PitchData = await PitchDetector.getCrepeCsvData(crepeFilePath);
        unlink(crepeFilePath); // Delete intermediary crepe output file.

        return results;
    }

    // Runs CREPE on the input file, saving the data to a csv file. Returns the path to the output file.
    private static async runCrepe(audioFilePath: string): Promise<string> {
        // this is absurdly sketchy and insecure. ideally we would transfer crepe
        // to javascript (which is very doable - we just need to use tensorflow for javascript and
        // convert a bunch of scipy/numpy code into js; most crucially we need to find an effective
        // .wav file reader [crepe uses scipy.wavFile.read()] to get data from the audio file for
        // inputting into the tensorflow model).
        console.log("running crepe model");

        const execString: string = "python3 -m crepe " + "--output " + PitchDetector.CrepeOutputDirectory + " --model-capacity full " + audioFilePath;

        console.log("executing string:");
        console.log(execString);

        await shell.exec(execString);

        console.log("crepe output complete for " + audioFilePath);
        const crepeFilePath: string = PitchDetector.CrepeOutputDirectory + "/" + path.basename(audioFilePath)

        console.log("output file: " + crepeFilePath);
        return crepeFilePath;
    }

    // Get CREPE output csv data
    private static async getCrepeCsvData(csvFilePath: string): Promise<PitchData> {
        // Load csv file contents
        const csvFile = await readFile(csvFilePath);

        // Read csv file row-by-row
        // Each row will be an object e.g. {time: '0.240', frequency: '440.034', confidence: '0.887045'}
        const parseResults: any[] = parse(csvFile, {columns: true}); // use first (header) line as labels

        const pitchData: PitchData = new PitchData();
        // Rotate csv file to produce three arrays: time[], frequency[], and confidence[].
        pitchData.time = parseResults.map(x => Number(x.time));
        pitchData.frequency = parseResults.map(x => Number(x.frequency));
        pitchData.confidence = parseResults.map(x => Number(x.confidence));

        return pitchData;
    }
}
