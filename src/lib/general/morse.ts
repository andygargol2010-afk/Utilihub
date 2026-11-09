export type MorseDirection = "to-morse" | "to-text";

export type MorseResult =
  | { status: "empty"; output: null; issue: "empty"; detail: null }
  | { status: "invalid"; output: null; issue: "char" | "token"; detail: string }
  | { status: "ok"; output: string; issue: null; detail: null; letters: number; words: number };

const TO_MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..",
  J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};

const FROM_MORSE = new Map(Object.entries(TO_MORSE).map(([char, code]) => [code, char]));

const ACCENT: Record<string, string> = {
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U",
  á: "A", é: "E", í: "I", ó: "O", ú: "U", ü: "U",
};

export function textToMorse(input: string): MorseResult {
  const raw = input.trim();
  if (!raw) return { status: "empty", output: null, issue: "empty", detail: null };
  const words = raw.split(/\s+/);
  const encoded: string[] = [];
  let letters = 0;
  for (const word of words) {
    const codes: string[] = [];
    for (const ch of word) {
      const folded = ACCENT[ch] ?? ch.toUpperCase();
      const code = TO_MORSE[folded];
      if (!code) return { status: "invalid", output: null, issue: "char", detail: ch };
      codes.push(code);
      letters += 1;
    }
    encoded.push(codes.join(" "));
  }
  return { status: "ok", output: encoded.join(" / "), issue: null, detail: null, letters, words: words.length };
}

export function morseToText(input: string): MorseResult {
  const raw = input.trim();
  if (!raw) return { status: "empty", output: null, issue: "empty", detail: null };
  const words = raw.split(/\s*\/\s*/);
  const decoded: string[] = [];
  let letters = 0;
  for (const word of words) {
    if (!word) return { status: "invalid", output: null, issue: "token", detail: "/" };
    let text = "";
    for (const token of word.split(/\s+/)) {
      if (!/^[.\-]+$/.test(token)) return { status: "invalid", output: null, issue: "token", detail: token };
      const char = FROM_MORSE.get(token);
      if (!char) return { status: "invalid", output: null, issue: "token", detail: token };
      text += char;
      letters += 1;
    }
    decoded.push(text);
  }
  return { status: "ok", output: decoded.join(" "), issue: null, detail: null, letters, words: words.length };
}
