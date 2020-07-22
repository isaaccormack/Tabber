import StringFret from "./data/stringFret";
import TabData from "./data/tabData";
import Tuning from "./data/tuning";
import Capo from "./data/capo";

// The purpose of this file is to provide a way of converting some form of tabbing data,
// i.e. strings + frets + timings, into an ASCII string.

// Dear lord this is garbage. In desperate need of cleaning up the interface and comments.
// Also in desperate need of rewriting and fixing. Plus the TabData class probably needs
// to be improved to make this make a lot more sense.

// Generates an actual tab string from a sequence of notes (in terms of strings & frets) that
// were played at each time sample (which may be null).
// Generates a tab with 1 horizontal space per 10 samples (i.e. 100 milliseconds). This has
// been arbitrarily picked, but should work okay to start - most people aren't playing 10 notes
// per second, and if they are, it's not clear that we'd be able to tab that correctly anyway.
// The earliest note in each 10-sample interval takes priority if multiple are found.
// NOTE: this generates the whole thing as one single line, so each guitar-string is separated
//       by a newline only at the end. this means that for long tabs, displaying it will get ugly.

export default class TabGenerator {

    private static readonly noteStrings: string[] = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];

    public static async generateTab(tabData: TabData, tuning: Tuning, capo: Capo): Promise<string> {
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
        const stringTabStrings: string[] = TabGenerator.getTuningNoteStrings(tuning).map(x => x + "|");
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

        const capoString: string = capo.getCapo() === 0 ? "(No capo)\n" : "(Capo " + capo.getCapo().toFixed(0) + ")\n";

        return capoString + stringTabStrings.join("\n");
    }

    // Gets the note that each string is tuned to. Ensures string lengths are uniform.
    // e.g. standard tuning results in
    // ["E", "B", "G", "D", "A", "E"]
    // but with standard tuning and tuning the A down a half-step, results in
    // ["E ", "B ", "G ", "D ", "G#", "E "]
    // So the start of the tab would look like the following:
    //
    // E|--    E |--
    // B|--    B |--
    // G|-- vs G |--
    // D|--    D |--
    // A|--    G#|--
    // E|--    E |--
    private static getTuningNoteStrings(tuning: Tuning): string[] {
        const noteStrings: string[] = tuning.getNotes().map(n => TabGenerator.noteStrings[n % 12]);
        const maxStringLength: number = Math.max(...noteStrings.map(x => x.length));
        return noteStrings.map(n => n.padEnd(maxStringLength));
    }
}
