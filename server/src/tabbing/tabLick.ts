import { Lick } from "../entity/lick";
import PitchData from "./data/pitchData";
import OnsetData from "./data/onsetData";
import TabData from "./data/tabData";
import PitchDetector from "./pitchDetector";
import OnsetDetector from "./onsetDetector";
import TabCalculator from "./tabCalculator";
import TabGenerator from "./tabGenerator";

// The purpose of this file is to provide a single interface to convert lick -> tab string.
// Should only ever require the "audioFileLocation", "tuning", and "audioLength" lick members to be valid;
// at present only requires the "audioFileLocation" lick member to be valid.

export default async function tabLick(lick: Lick): Promise<string> {
    const audioFilePath: string = lick.audioFileLocation;

    console.log("tabbing lick with crepe.");
    console.log(audioFilePath);

    // Get data from audio file as javascript objects. This involves tabbing with CREPE and another
    // external python script for getting frequency & amplitude data for every 10 ms section of the audio.
    const pitchData: PitchData = await PitchDetector.getPitchData(audioFilePath);
    console.log("pitch data:");
    console.log(pitchData);

    // Get note onset times from audio file. Requires use of external python library & script as of now.
    const onsetData: OnsetData = await OnsetDetector.getOnsetData(audioFilePath);
    console.log("onset data:");
    console.log(onsetData);

    // Get tabbable data
    const tabData: TabData = await TabCalculator.getTabData(pitchData, onsetData);
    console.log("tab data:");
    console.log(tabData);

    // Generate tab string from tabbable data
    const tab: string = await TabGenerator.generateTab(tabData);
    console.log("tab:");
    console.log(tab);

    // Display calculated data for each note found in the audio file
    console.log("Processed tab data:");
    //console.log("Time\tIndex\tFrequency\tConfidence\tAmplitude\tNote\tString\tFret")
    console.log("Time\tIndex\tFrequency\tConfidence\tNote\tString\tFret")
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
            console.log(str);
        }
    }

    console.log("done tabbing lick.");
    return tab;
}
