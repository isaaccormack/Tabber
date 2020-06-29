import { Lick } from "../entity/lick";
import { getAudioData } from "./processAudio";
import { generateTabString } from "./tabStringHandler";
import AudioData from "./audioData";
import { calculateTab } from "./tabCalculator";
import TabData from "./tabData";

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
                            + tabData.peakFrequencies[i] + "\t\t"
                            + audioData.peakAmplitude[idx] + "\t"
                            + tabData.peakNotes[i] + "\t"
                            + tabData.peakStringsAndFrets[i].stringIdx + "\t"
                            + tabData.peakStringsAndFrets[i].fret;
        console.log(str);
    }

    const tab: string = generateTabString(tabData);
    console.log("tab:");
    console.log(tab);

    console.log("done tabbing lick.");
    return tab;
}
