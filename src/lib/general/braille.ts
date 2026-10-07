/** Grade-1 braille: letters, Spanish accents, numbers, and a small punctuation set. */

const LETTERS: Record<string, string> = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  ñ: "⠻",
  á: "⠷",
  é: "⠮",
  í: "⠌",
  ó: "⠬",
  ú: "⠾",
  ü: "⠳",
};

const PUNCT: Record<string, string> = {
  ".": "⠲",
  ",": "⠂",
  "?": "⠢",
  "!": "⠖",
  "'": "⠄",
  "-": "⠤",
  ":": "⠒",
  ";": "⠆",
};

const NUMBER_SIGN = "⠼";
const CAPITAL_SIGN = "⠠";
const DIGIT_CELLS = ["⠁", "⠃", "⠉", "⠙", "⠑", "⠋", "⠛", "⠓", "⠊", "⠚"];

const FROM_CELL: Record<string, string> = {};
for (const [letter, cell] of Object.entries(LETTERS)) FROM_CELL[cell] = letter;
for (const [mark, cell] of Object.entries(PUNCT)) FROM_CELL[cell] = mark;

export type BrailleResult =
  | { status: "empty" }
  | { status: "invalid"; issue: "char" | "cell" | "number"; detail: string }
  | { status: "ok"; output: string; cells: number; numbers: number; capitals: number };

function fold(char: string) {
  return char.normalize("NFC").toLowerCase();
}

export function textToBraille(raw: string): BrailleResult {
  const text = raw.normalize("NFC");
  if (text.trim() === "") return { status: "empty" };
  let output = "";
  let cells = 0;
  let numbers = 0;
  let capitals = 0;
  let numberMode = false;
  for (const char of text) {
    if (char === " " || char === "\n") {
      output += char;
      numberMode = false;
      continue;
    }
    if (char >= "0" && char <= "9") {
      if (!numberMode) {
        output += NUMBER_SIGN;
        cells += 1;
        numbers += 1;
        numberMode = true;
      }
      output += DIGIT_CELLS[Number(char)];
      cells += 1;
      continue;
    }
    numberMode = false;
    if (PUNCT[char]) {
      output += PUNCT[char];
      cells += 1;
      continue;
    }
    const lower = fold(char);
    const cell = LETTERS[lower];
    if (!cell) return { status: "invalid", issue: "char", detail: char };
    if (char !== lower && char.toLowerCase() === lower) {
      output += CAPITAL_SIGN;
      cells += 1;
      capitals += 1;
    }
    output += cell;
    cells += 1;
  }
  return { status: "ok", output, cells, numbers, capitals };
}

export function brailleToText(raw: string): BrailleResult {
  const text = raw.normalize("NFC");
  if (text.trim() === "") return { status: "empty" };
  let output = "";
  let cells = 0;
  let numbers = 0;
  let capitals = 0;
  let i = 0;
  const chars = [...text];
  while (i < chars.length) {
    const char = chars[i];
    if (char === " " || char === "\n") {
      output += char;
      i += 1;
      continue;
    }
    if (char === CAPITAL_SIGN) {
      const next = chars[i + 1];
      const letter = next ? FROM_CELL[next] : undefined;
      if (!letter || letter.length !== 1 || letter < "a" || (letter > "z" && letter !== "ñ")) {
        return { status: "invalid", issue: "cell", detail: CAPITAL_SIGN };
      }
      output += letter.toUpperCase();
      cells += 2;
      capitals += 1;
      i += 2;
      continue;
    }
    if (char === NUMBER_SIGN) {
      i += 1;
      cells += 1;
      numbers += 1;
      let found = false;
      while (i < chars.length && DIGIT_CELLS.includes(chars[i])) {
        output += String(DIGIT_CELLS.indexOf(chars[i]));
        cells += 1;
        found = true;
        i += 1;
      }
      if (!found) return { status: "invalid", issue: "number", detail: NUMBER_SIGN };
      continue;
    }
    const mapped = FROM_CELL[char];
    if (!mapped) return { status: "invalid", issue: "cell", detail: char };
    output += mapped;
    cells += 1;
    i += 1;
  }
  return { status: "ok", output, cells, numbers, capitals };
}
