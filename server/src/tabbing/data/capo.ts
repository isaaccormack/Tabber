/* Class representing a capo. Simply an immutable nonnegative integer between 0 and 24, inclusive. */
export default class Capo {
    private capo: number;

    constructor(capo: number) {
        this.capo = Math.round(capo);
        if (capo < 0 || capo > 24) {
            throw new Error("Invalid capo");
        }
    }

    public getCapo(): number {
        return this.capo;
    }
}
