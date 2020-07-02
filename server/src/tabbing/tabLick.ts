import { Lick } from "../entity/lick";
import { getAudioData } from "./processAudio";
import { generateTabString } from "./tabStringHandler";
import AudioData from "./data/audioData";
import { calculateTab } from "./tabCalculator";
import TabData from "./data/tabData";

// The purpose of this file is to provide a single interface to convert lick -> tab string.
// Should only ever require the "audioFileLocation", "tuning", and "audioLength" lick members to be valid;
// at present only requires the "audioFileLocation" lick member to be valid.

export default async function tabLick(lick: Lick): Promise<string> {
    const audioFilePath: string = lick.audioFileLocation;

    console.log("tabbing lick with crepe.");
    console.log(audioFilePath);

    // Get data from audio file as javascript objects. This involves tabbing with CREPE and another
    // external python script for getting frequency & amplitude data for every 10 ms section of the audio.
    const audioData: AudioData = await getAudioData(audioFilePath);
    console.log("final audio data:");
    console.log(audioData);

    // Get tabbable data
    const tabData: TabData = await calculateTab(audioData);

    // Generate tab string from tabbable data
    const tab: string = await generateTabString(tabData);
    console.log("tab:");
    console.log(tab);

    // Display calculated data for each note found in the audio file
    console.log("Processed tab data:");
    console.log("Time\tIndex\tFrequency\tConfidence\tAmplitude\tNote\tString\tFret")
    for (var idx = 0; idx < tabData.totalSamples; ++idx) {
        if (tabData.playedStringFrets[idx]) {
            const str: string = audioData.time[idx] + "\t"
                                + idx + "\t"
                                + audioData.frequency[idx].toPrecision(6) + "\t\t"
                                + audioData.confidence[idx].toFixed(6) + "\t"
                                + audioData.peakAmplitude[idx].toPrecision(10) + "\t"
                                + Math.round(69 + 12 * Math.log2(audioData.frequency[idx] / 440.0))  + "\t" // print note
                                + tabData.playedStringFrets[idx].stringIdx + "\t"
                                + tabData.playedStringFrets[idx].fret;
            console.log(str);
        }
    }

    console.log("done tabbing lick.");
    return tab;
}
