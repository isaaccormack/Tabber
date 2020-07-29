import PitchData from "./data/pitchData";
import OnsetData from "./data/onsetData";
import TabData from "./data/tabData";
import Tuning from "./data/tuning";
import StringFret from "./data/stringFret";
import Capo from "./data/capo";

// The purpose of this class is to handle conversion from frequency & onset data,
// as well as tuning + capo + (currently-unimplemented) user input, to a series of
// strings + frets + times of played notes.
//
// fret values returned are relative to the capo; e.g. a capo of 5 is treated as tuning
// the guitar 5 semitones higher.

export default class TabCalculator {

    public static async getTabData(pitch: PitchData, onsets: OnsetData, tuning: Tuning, capo: Capo): Promise<TabData> {
        const tabData: TabData = new TabData();
        console.log("tuning:");
        console.log(tuning.getNotes());
        console.log("capo:");
        console.log(capo.getCapo());

        tabData.totalSamples = pitch.time.length;
        const onsetIndices: number[] = TabCalculator.onsetsToIndices(onsets.time, pitch.time);

        const playedStringFrets: (StringFret | null)[] = [];
        for (var i = 0; i < pitch.time.length; ++i) {
            if (onsetIndices.includes(i)) {
                playedStringFrets.push(TabCalculator.getStringAndFret(TabCalculator.getNote(pitch.frequency[i]), tuning, capo));
            } else {
                playedStringFrets.push(null);
            }
        }

        tabData.playedStringFrets = playedStringFrets;

        return tabData;
    }

    private static onsetsToIndices(onsetTimes: number[], sampleTimes: number[]): number[] {
        // convert from onset times to indices of list of times
        const onsetIndices: number[] = [];
        let curOnset = 0;
        for (var i = 0; i < sampleTimes.length - 1 && curOnset < onsetTimes.length; ++i) {
            let isInSample = false;
            while (onsetTimes[curOnset] >= sampleTimes[i] && onsetTimes[curOnset] < sampleTimes[i+1]) {
                isInSample = true;
                ++curOnset;
            }
            if (isInSample) {
                onsetIndices.push(i);
            }
        }
        return onsetIndices;
    }

    public static getNote(pitch: number): number {
        // Convert a pitch to an integer between 0 and 127
        // see en.wikipedia.org/wiki/MIDI_tuning_standard#Frequency_values
        return Math.round(69 + 12 * Math.log2(pitch / 440.0));
    }

    // note is a MIDI-tuning-standard note index, between 0 (C_{-1}) and 127 (G_9).
    // Low E on guitar is E_2 (80 Hz, index 40).
    // For now, we take the trivial idea that the note is played on the highest-pitched
    // string that can play it.
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
    public static getStringAndFret(note: number, tuning: Tuning, capo: Capo): StringFret {
        const notes: number[] = tuning.getNotes().map(x => x + capo.getCapo());
        for (var i = 0; i < notes.length; ++i) {
            if (note >= notes[i]) {
                return { stringIdx: i, fret: note - notes[i] };
            }
        }
        throw new Error("Could not determine string and fret of note (note index: " + note + ")");
    }
}
