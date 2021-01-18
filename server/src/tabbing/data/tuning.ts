
// Class representing a guitar tuning. Assumes a 6-string guitar.
export default class Tuning {
    private notes: number[];

    constructor(notes: number[]) {
        if (notes.length != 6) {
            throw new Error("Invalid tuning");
        }
        // Ensure notes are integers.
        this.notes = notes.map(n => Math.round(n));
    }

    public getNotes() {
        return this.notes;
    }

    // Factory functions
    public static readonly Standard: Tuning = new Tuning([64, 59, 55, 50, 45, 40]);
    public static readonly DropD: Tuning = new Tuning([64, 59, 55, 50, 45, 38]);
    public static readonly OpenG: Tuning = new Tuning([62, 59, 55, 50, 43, 38]);

    public static fromString(tuning: string): Tuning {
        const cleanString: string = tuning.toLowerCase().trim();
        if (cleanString === "standard") {
            return Tuning.Standard;
        } else if (cleanString === "drop d") {
            return Tuning.DropD;
        } else if (cleanString === "open g") {
            return Tuning.OpenG;
        } else {
            throw new Error("invalid tuning");
        }
    }
}
