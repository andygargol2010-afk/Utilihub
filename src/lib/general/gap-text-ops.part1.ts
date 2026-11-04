// Part 1 of 3 — split from gap-text-ops.ts on 2026-11-04. Edit here; gap-text-ops.ts re-exports.

/** Pure logic for gap text tools (morse, binary, frequency, reading level, anagram, palindrome, numbers-to-words). */
export const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", _: "..--.-", '"': ".-..-.", $: "...-..-", "@": ".--.-.",
};
export const MORSE_REV: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export function looksLikeMorse(s: string) {
  const t = s.trim();
  return t.length > 0 && /^[\s./·\-–—]*$/.test(t) && /[.\-·–—]/.test(t);
}

export function toMorse(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => (ch === " " || ch === "\n" ? "/" : MORSE[ch] ?? ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

export function fromMorse(text: string) {
  return text
    .replace(/[·•]/g, ".")
    .replace(/[–—_]/g, "-")
    .trim()
    .split(/\s*\/\s*/)
    .map((word) => word.trim().split(/\s+/).map((code) => MORSE_REV[code] ?? "").join(""))
    .join(" ")
    .trim();
}

export function looksLikeBinary(s: string) {
  const clean = s.replace(/\s+/g, "");
  return clean.length > 0 && /^[01]+$/.test(clean) && clean.length % 8 === 0;
}

export function textToBinary(text: string) {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

export function binaryToText(text: string) {
  const clean = text.replace(/\s+/g, "");
  if (!clean || clean.length % 8 !== 0 || /[^01]/.test(clean)) {
    throw new Error("Binary must be groups of 0/1 with length multiple of 8.");
  }
  const bytes = new Uint8Array(clean.length / 8);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
  return new TextDecoder().decode(bytes);
}

export function wordFrequency(text: string) {
  const tokens = text.toLowerCase().match(/[a-zà-ÿ0-9']+/gi) ?? [];
  if (!tokens.length) throw new Error("Enter some text with words.");
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) ?? 0) + 1);
  const total = tokens.length;
  const ranked = [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const lines = ranked.map(([w, c], i) => `${i + 1}. ${w}: ${c} (${((c / total) * 100).toFixed(1)}%)`);
  return `Total words: ${total}\nUnique: ${map.size}\n\n${lines.join("\n")}`;
}

export function countSyllablesEn(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

export function countSyllablesEs(word: string) {
  const w = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiou]+/g);
  return Math.max(1, groups?.length ?? 1);
}
