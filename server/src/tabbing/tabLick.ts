import { Lick } from "../entity/lick";
import { getAudioData } from "./processAudio";
import { generateTabString } from "./tabStringHandler";
import AudioData from "./data/audioData";
import { calculateTab } from "./tabCalculator";
import TabData from "./data/tabData";

// The purpose of this file is to provide a single interface to convert lick -> tab string.
export default async function tabLick(lick: Lick): Promise<string> {
    console.log("tabbing lick with crepe.");
    console.log(lick);

    const audioData: AudioData = await getAudioData(lick);

    console.log("final audio data:");
    console.log(audioData);

    const tabData: TabData = await calculateTab(audioData);

    // 10-millisecond samples
    console.log("Processed audio data:");
    console.log("Time\tIndex\tFrequency\tAmplitude\tNote\tString\tFret")
    for (var i = 0; i < tabData.peakIndices.length; ++i) {
        const idx: number = tabData.peakIndices[i];
        const str: string = audioData.time[idx] + "\t"
                            + idx + "\t"
                            + audioData.frequency[idx] + "\t\t"
                            + audioData.peakAmplitude[idx] + "\t"
                            + Math.round(69 + 12 * Math.log2(audioData.frequency[idx] / 440.0))  + "\t" // print note
                            + tabData.peakStringsAndFrets[i].stringIdx + "\t"
                            + tabData.peakStringsAndFrets[i].fret;
        console.log(str);
    }

    const tab: string = await generateTabString(tabData);
    console.log("tab:");
    console.log(tab);

    console.log("done tabbing lick.");
    return tab;
}
