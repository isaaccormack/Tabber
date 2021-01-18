import PitchData from "./data/pitchData";
import OnsetData from "./data/onsetData";
import TabData from "./data/tabData";
import Tuning from "./data/tuning";
import PitchDetector from "./pitchDetector";
import OnsetDetector from "./onsetDetector";
import TabCalculator from "./tabCalculator";
import TabGenerator from "./tabGenerator";
import Capo from "./data/capo";
import { debugLogger } from "./debugLogger";

// The purpose of this file is to provide a single interface to convert lick -> tab string.
// Should only ever require the "audioFileLocation", "tuning", "capo", and "audioLength" lick members to be valid;
// at present only requires the "audioFileLocation", "tuning", and "capo" lick members to be valid.

async function tabLick(audioFilePath: string, tuningStr: string, capoNum: number): Promise<string> {

    const tuning: Tuning = Tuning.fromString(tuningStr); // 6-element array; e.g. standard: [64, 59, 55, 50, 45, 40]
    const capo: Capo = new Capo(capoNum);

    debugLogger("tabbing lick with crepe.");
    debugLogger(audioFilePath);

    // Get data from audio file as javascript objects. This involves tabbing with CREPE and another
    // external python script for getting frequency & amplitude data for every 10 ms section of the audio.
    const pitchData: PitchData = await PitchDetector.getPitchData(audioFilePath);
    debugLogger("pitch data:");
    debugLogger(pitchData);

    // Get note onset times from audio file. Requires use of external python library & script as of now.
    const onsetData: OnsetData = await OnsetDetector.getOnsetData(audioFilePath);
    debugLogger("onset data:");
    debugLogger(onsetData);

    // Get tabbable data, taking tuning & capo into account
    const tabData: TabData = await TabCalculator.getTabData(pitchData, onsetData, tuning, capo);
    debugLogger("tab data:");
    debugLogger(tabData);

    // Generate tab string from tabbable data
    const tab: string = await TabGenerator.generateTab(tabData, tuning, capo);
    debugLogger("tab:");
    debugLogger(tab);

    // Display calculated data for each note found in the audio file
    debugLogger("Processed tab data:");
    //debugLogger("Time\tIndex\tFrequency\tConfidence\tAmplitude\tNote\tString\tFret")
    debugLogger("Time\tIndex\tFrequency\tConfidence\tNote\tString\tFret")
    for (var idx = 0; idx < tabData.totalSamples; ++idx) {
        if (tabData.playedStringFrets[idx]) {
            const str: string = pitchData.time[idx] + "\t"
                                + idx + "\t"
                                + pitchData.frequency[idx].toPrecision(6) + "\t\t"
                                + pitchData.confidence[idx].toFixed(6) + "\t"
                                //+ pitchData.peakAmplitude[idx].toPrecision(10) + "\t"
                                + Math.round(69 + 12 * Math.log2(pitchData.frequency[idx] / 440.0))  + "\t" // print note
                                + tabData.playedStringFrets[idx].stringIdx + "\t"
                                + tabData.playedStringFrets[idx].fret;
            debugLogger(str);
        }
    }

    debugLogger("done tabbing lick.");
    return tab;
}

module.exports = {tabLick};
