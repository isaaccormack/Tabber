import StringFret from "./stringFret";

/* Utility class for storing tabbable data, i.e. strings + frets + timings */
export default class TabData {
    timeLength: number;
    peakIndices: number[];
    peakFrequencies: number[];
    peakNotes: number[];
    peakStringsAndFrets: StringFret[];
}
