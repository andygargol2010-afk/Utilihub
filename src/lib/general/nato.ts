/** ICAO Annex 10 spelling alphabet. Digits use "niner" for 9. */

export const ICAO_LETTERS: Record<string, string> = {
  A: "Alfa",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliett",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
};

export const ICAO_DIGITS: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Tree",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Niner",
};

export const PLAIN_DIGITS: Record<string, string> = {
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

const PUNCT: Record<string, string> = {
  " ": "Space",
  "-": "Hyphen",
  ".": "Stop",
  "/": "Slash",
  "@": "At",
};

export type NatoOptions = {
  digitStyle: "icao" | "plain";
  keepSpaces: boolean;
  labelPunctuation: boolean;
};

export type NatoToken = { source: string; word: string; kind: "letter" | "digit" | "space" | "punct" | "other" };

export function spellNato(input: string, options: NatoOptions): { tokens: NatoToken[]; line: string; skipped: number } {
  const digits = options.digitStyle === "icao" ? ICAO_DIGITS : PLAIN_DIGITS;
  const tokens: NatoToken[] = [];
  let skipped = 0;
  const folded = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const ch of folded) {
    const upper = ch.toUpperCase();
    if (ICAO_LETTERS[upper]) {
      tokens.push({ source: ch, word: ICAO_LETTERS[upper], kind: "letter" });
      continue;
    }
    if (digits[ch]) {
      tokens.push({ source: ch, word: digits[ch], kind: "digit" });
      continue;
    }
    if (ch === " " || ch === "\n" || ch === "\t") {
      if (options.keepSpaces) tokens.push({ source: " ", word: "Space", kind: "space" });
      continue;
    }
    if (PUNCT[ch]) {
      if (options.labelPunctuation) tokens.push({ source: ch, word: PUNCT[ch], kind: "punct" });
      else skipped += 1;
      continue;
    }
    skipped += 1;
  }
  return { tokens, line: tokens.map((token) => token.word).join(" "), skipped };
}

export function callsignPreset() {
  return "UTILIHUB";
}

export function platePreset() {
  return "AB-19";
}
