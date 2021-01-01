import moment from 'moment';
import { LickInterface } from "../../common/lick/interface/LickInterface";

export function formatLickLength(length: number): string {
  return length < 10 ? "0:0" + length.toString() :
    length < 60 ? "0:" + length.toString() : "1:00"
}

export function formatCapo(capo: number | undefined): string {
  if (capo === undefined) return "";

  let formattedCapo = capo === 1 ? "1st" :
    capo === 2 ? "2nd" :
      capo === 3 ? "3rd" :
        capo === 4 ? "4th" :
          capo === 5 ? "5th" :
            capo === 6 ? "6th" :
              capo === 7 ? "7th" :
                capo === 8 ? "8th" :
                  capo === 9 ? "9th" :
                    capo === 10 ? "10th" :
                      capo === 11 ? "11th" :
                        capo === 12 ? "12th" : "No Capo"

  if (formattedCapo !== "No Capo") {
    formattedCapo += " fret"
  }

  return formattedCapo;
}

export function formatDate(date: string) {
  return moment(date).format("h:mma MMM. D, YYYY");
}

export function formatDateNoTime(date: string) {
  return moment(date).format("MMM. D, YYYY");
}

export function formatSumOfLickLengths(lickLengths: number): string {
  if (lickLengths < 60) {
    return lickLengths + " seconds"
  }
  return Math.floor(lickLengths / 60) + "m " + lickLengths % 60 + "s";
}