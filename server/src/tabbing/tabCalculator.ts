import AudioData from "./data/audioData";
import StringFret from "./data/stringFret";
import TabData from "./data/tabData";

// The purpose of this file is to provide a way of converting AudioData into tabbable
// data, i.e. strings + frets + timings

export function calculateTab(audioData: AudioData): TabData {

    const tabData: TabData = new TabData();

    tabData.timeLength = audioData.time.length;
    tabData.peakIndices = getLocalMaximaIndices(audioData.peakAmplitude);
    tabData.peakIndices = tabData.peakIndices.map(idx => audioData.frequency[idx]);
    tabData.peakNotes = tabData.peakFrequencies.map(freq => getNote(freq));
    tabData.peakStringsAndFrets = tabData.peakNotes.map(note => getStringAndFret(note));

    return tabData;
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
