/** Estimate password entropy locally. Pool bits are a charset upper bound, not crack time. */

export type EntropyBand = "empty" | "weak" | "fair" | "strong" | "very-strong";

export type PasswordEntropy = {
  status: "empty" | "ok";
  length: number;
  charset: number;
  classes: string[];
  poolBits: number | null;
  shannonBits: number | null;
  unique: number;
  hasSpace: boolean;
  hasNonAscii: boolean;
  band: EntropyBand;
};

const SYMBOLS = new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");

export function estimatePasswordEntropy(input: string): PasswordEntropy {
  if (!input) {
    return { status: "empty", length: 0, charset: 0, classes: [], poolBits: null, shannonBits: null, unique: 0, hasSpace: false, hasNonAscii: false, band: "empty" };
  }
  let lower = false;
  let upper = false;
  let digit = false;
  let symbol = false;
  let space = false;
  let nonAscii = 0;
  const seen = new Map<string, number>();
  for (const ch of input) {
    seen.set(ch, (seen.get(ch) ?? 0) + 1);
    const code = ch.codePointAt(0) ?? 0;
    if (code > 126 || code < 32) {
      if (ch !== " " && ch !== "\t") nonAscii += 1;
      else space = true;
      continue;
    }
    if (ch >= "a" && ch <= "z") lower = true;
    else if (ch >= "A" && ch <= "Z") upper = true;
    else if (ch >= "0" && ch <= "9") digit = true;
    else if (ch === " ") space = true;
    else if (SYMBOLS.has(ch)) symbol = true;
  }
  const classes: string[] = [];
  let charset = 0;
  if (lower) { classes.push("lower"); charset += 26; }
  if (upper) { classes.push("upper"); charset += 26; }
  if (digit) { classes.push("digit"); charset += 10; }
  if (symbol) { classes.push("symbol"); charset += 33; }
  if (space) { classes.push("space"); charset += 1; }
  if (nonAscii > 0) { classes.push("other"); charset += Math.min(nonAscii, 50); }
  const length = [...input].length;
  const poolBits = charset > 1 ? length * Math.log2(charset) : length > 0 && charset === 1 ? 0 : null;
  let shannon = 0;
  for (const count of seen.values()) {
    const p = count / length;
    shannon -= p * Math.log2(p);
  }
  const shannonBits = shannon * length;
  const bits = poolBits ?? 0;
  const band: EntropyBand = bits < 28 ? "weak" : bits < 50 ? "fair" : bits < 70 ? "strong" : "very-strong";
  return { status: "ok", length, charset, classes, poolBits, shannonBits, unique: seen.size, hasSpace: space, hasNonAscii: nonAscii > 0, band };
}
