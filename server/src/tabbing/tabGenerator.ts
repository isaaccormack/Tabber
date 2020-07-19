import StringFret from "./data/stringFret";
import TabData from "./data/tabData";
import Tuning from "./data/tuning";

// The purpose of this file is to provide a way of converting some form of tabbing data,
// i.e. strings + frets + timings, into an ASCII string.

// Dear lord this is garbage. In desperate need of cleaning up the interface and comments.
// Also in desperate need of rewriting and fixing. Plus the TabData class probably needs
// to be improved to make this make a lot more sense.

// TODO: prepend note-that-the-string-is-tuned-to to each guitar string's line

// Generates an actual tab string from a sequence of indices which correspond to the times
// at which notes were played, and a sequence of notes (in terms of strings & frets) that
// were played at those times. The lengths of the arrays are equal.
// Generates a tab with 1 horizontal space per 10 samples (i.e. 100 milliseconds). This has
// been arbitrarily picked, but should work okay to start - most people aren't playing 10 notes
// per second, and if they are, it's not clear that we'd be able to tab that correctly anyway.
// The earliest note in each 10-sample interval takes priority if multiple are found.
// NOTE: this fails for frets >= 10 (i.e. it can't deal with 2-digit frets - if one is
//       encountered, it will push the rest of the line to the right by one character.)
// NOTE: this generates the whole thing as one single line, so each guitar-string is separated
//       by a newline only at the end. this means that for long tabs, displaying it will get ugly.

export default class TabGenerator {

    private static readonly noteStrings: string[] = ["C ", "C#", "D ", "Eb", "E ", "F ", "F#", "G ", "G#", "A ", "Bb", "B "];

    public static async generateTab(tabData: TabData, tuning: Tuning): Promise<string> {
        const totalSamples: number = tabData.totalSamples;
        const playedStringFrets: (StringFret | null)[] = tabData.playedStringFrets;

        // this is ugly. feel free to clean it up.  We should probably just make the tab-lines, then replace
        // values as necessary.

        // Take first element in each 10-sample range
        const sequenceData: (StringFret | null)[] = new Array(Math.ceil(totalSamples / 10)).fill(null);
        for (var i = 0; i < totalSamples; ++i) {
            const curData: StringFret | null = sequenceData[Math.floor(i/10)];
            sequenceData[Math.floor(i/10)] = !curData && playedStringFrets[i] ? playedStringFrets[i] : curData;
        }

        // one data-string per guitar-string. These are joined by newlines after tabbing is complete.
        const stringTabStrings: string[] = tuning.getNotes().map(n => TabGenerator.noteStrings[n % 12] + "|");
        for (var i = 0; i < sequenceData.length; ++i) {
            let stringVal: string[] = new Array(6).fill("-");
            if (sequenceData[i] !== null) {
                const fretString: string = sequenceData[i].fret.toString();
                for (var j = 1; j < fretString.length; ++j) {
                    stringVal = stringVal.map(x => x + "-");
                }
                stringVal[sequenceData[i].stringIdx] = fretString;

            }
            stringVal.map((x, idx) => stringTabStrings[idx] += x);
        }

        // End each string with | character
        for (var i = 0; i < stringTabStrings.length; ++i) {
            stringTabStrings[i] += "|";
        }

        return stringTabStrings.join("\n");
    }
}
