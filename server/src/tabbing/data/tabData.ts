import StringFret from "./stringFret";

/* Utility class for storing tabbable data, i.e. strings + frets + timings */
export default class TabData {
    totalSamples: number;
    playedStringFrets: (StringFret | null)[]; // One element per sample (10ms interval). null if not played or else a valid StringFret. Length == totalSamples.
}
