import StringFret from "./stringFret";

/* Utility class for storing tabbable data, i.e. strings + frets + timings */
export default class TabData {
    totalSamples: number;
    peakIndices: number[]; // which (0-indexed) sample indices had notes played at them
    peakStringsAndFrets: StringFret[]; // what were the notes at those indices
}
