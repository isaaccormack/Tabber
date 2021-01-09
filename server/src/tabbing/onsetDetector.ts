import OnsetData from "./data/onsetData";
import shell from "shelljs";
import path from "path";
import parse from "csv-parse/lib/sync";
import fs from "fs";
import util from "util";

// These are necessary because async fs functions are unavailable for some reason
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

// The purpose of this class is to detect onsets

export default class OnsetDetector {

    public static async getOnsetData(audioFilepath: string): Promise<OnsetData> {
        const onsetFilePath: string = await OnsetDetector.runOnsetDetection(audioFilepath);
        const results: OnsetData = await OnsetDetector.readOnsetData(onsetFilePath);
        unlink(onsetFilePath); // Delete intermediary onset detection output file.

        return results;
    }

    private static async runOnsetDetection(audioFilePath: string): Promise<string> {
        // this is pretty sketchy and slow. ideally we transfer this to pure js, or at the very least
        // merge it with crepe's data analysis so that we don't spawn multiple shells and read the file
        // multiple times. if we could find an effective .wav file reader, then this would all be thoroughly
        // doable. (or, if we could modify crepe to take mp3 or other data formats, then a reader for those)
        console.log("getting onset data");

        const crepeOutputDirectory: string = "crepe"; // TODO: remove this asap; use a tmp file
        const onsetFilePath: string = crepeOutputDirectory + "/" + path.basename(audioFilePath) + "-amplitude.csv";
        const execString: string = "python3 tabbing/onset_detect.py --input " + audioFilePath + " --output " + onsetFilePath;

        console.log("executing string:");
        console.log(execString);

        await shell.exec(execString);

        console.log("onset data extraction complete for " + audioFilePath);

        console.log("output file: " + onsetFilePath);

        return onsetFilePath;
    }

    // Get onset output csv data
    private static async readOnsetData(filePath: string): Promise<OnsetData> {
        // Load csv file contents
        const csvFile = await readFile(filePath);

        // Read csv file row-by-row
        // Each row will be an object e.g. {time: '0.240'}
        const parseResults: any[] = parse(csvFile, {columns: true}); // use first (header) line as labels

        const onsetData: OnsetData = new OnsetData();
        // Rotate csv file to produce an array time[] of timestamps that onsets are detected at
        onsetData.time = parseResults.map(x => Number(x.time));

        return onsetData;
    }
}
