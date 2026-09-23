/** Pure logic for gap text tools (morse, binary, frequency, reading level, anagram, palindrome, numbers-to-words). */
const MORSE: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....",
  "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
  "+": ".-.-.", "-": "-....-", _: "..--.-", '"': ".-..-.", $: "...-..-", "@": ".--.-.",
};
const MORSE_REV: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function looksLikeMorse(s: string) {
  const t = s.trim();
  return t.length > 0 && /^[\s./·\-–—]*$/.test(t) && /[.\-·–—]/.test(t);
}

function toMorse(text: string) {
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

function fromMorse(text: string) {
  return text
    .replace(/[·•]/g, ".")
    .replace(/[–—_]/g, "-")
    .trim()
    .split(/\s*\/\s*/)
    .map((word) => word.trim().split(/\s+/).map((code) => MORSE_REV[code] ?? "").join(""))
    .join(" ")
    .trim();
}

function looksLikeBinary(s: string) {
  const clean = s.replace(/\s+/g, "");
  return clean.length > 0 && /^[01]+$/.test(clean) && clean.length % 8 === 0;
}

function textToBinary(text: string) {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(text: string) {
  const clean = text.replace(/\s+/g, "");
  if (!clean || clean.length % 8 !== 0 || /[^01]/.test(clean)) {
    throw new Error("Binary must be groups of 0/1 with length multiple of 8.");
  }
  const bytes = new Uint8Array(clean.length / 8);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 8, i * 8 + 8), 2);
  return new TextDecoder().decode(bytes);
}

function wordFrequency(text: string) {
  const tokens = text.toLowerCase().match(/[a-zà-ÿ0-9']+/gi) ?? [];
  if (!tokens.length) throw new Error("Enter some text with words.");
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) ?? 0) + 1);
  const total = tokens.length;
  const ranked = [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const lines = ranked.map(([w, c], i) => `${i + 1}. ${w}: ${c} (${((c / total) * 100).toFixed(1)}%)`);
  return `Total words: ${total}\nUnique: ${map.size}\n\n${lines.join("\n")}`;
}

function countSyllablesEn(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 1);
}

function countSyllablesEs(word: string) {
  const w = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiou]+/g);
  return Math.max(1, groups?.length ?? 1);
}

function readingLevel(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+/g)?.length ?? (text.trim() ? 1 : 0);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  if (words < 5 || sentences < 1) throw new Error("Enter a longer text (a few sentences).");
  const isEs = /[áéíóúñ¿¡]/i.test(text) || /\b(el|la|los|las|de|que|y|en|un|una|es)\b/i.test(text);
  const wordList = text.toLowerCase().match(/[a-zà-ÿ']+/gi) ?? [];
  const syllables = wordList.reduce((s, w) => s + (isEs ? countSyllablesEs(w) : countSyllablesEn(w)), 0);
  const asl = words / sentences;
  const asw = syllables / words;
  if (isEs) {
    // Fernández-Huerta
    const score = 206.84 - 0.6 * asw * 100 / words * words - 1.02 * asl;
    const fixed = 206.84 - 60 * asw - 1.02 * asl;
    let label = "Muy difícil";
    if (fixed >= 90) label = "Muy fácil";
    else if (fixed >= 80) label = "Fácil";
    else if (fixed >= 70) label = "Algo fácil";
    else if (fixed >= 60) label = "Normal";
    else if (fixed >= 50) label = "Algo difícil";
    else if (fixed >= 30) label = "Difícil";
    return `Score: ${fixed.toFixed(1)} (Fernández-Huerta / Spanish)\nLevel: ${label}\nWords: ${words} · Sentences: ${sentences} · Syllables ≈ ${syllables}`;
  }
  // Flesch Reading Ease
  const score = 206.835 - 1.015 * asl - 84.6 * asw;
  let label = "Very difficult";
  if (score >= 90) label = "Very easy";
  else if (score >= 80) label = "Easy";
  else if (score >= 70) label = "Fairly easy";
  else if (score >= 60) label = "Standard";
  else if (score >= 50) label = "Fairly difficult";
  else if (score >= 30) label = "Difficult";
  return `Score: ${score.toFixed(1)} (Flesch Reading Ease)\nLevel: ${label}\nWords: ${words} · Sentences: ${sentences} · Syllables ≈ ${syllables}`;
}

function normalizeLetters(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function anagramCheck(a: string, b: string) {
  if (!a.trim() || !b.trim()) throw new Error("Enter two words or phrases.");
  const na = normalizeLetters(a).split("").sort().join("");
  const nb = normalizeLetters(b).split("").sort().join("");
  if (!na || !nb) throw new Error("Enter two words or phrases.");
  return na === nb ? `Yes — anagrams.\nA: ${a.trim()}\nB: ${b.trim()}` : `No — not anagrams.\nA letters: ${na}\nB letters: ${nb}`;
}

function palindromeCheck(text: string) {
  if (!text.trim()) throw new Error("Enter some text.");
  const n = normalizeLetters(text);
  if (!n) throw new Error("Enter some text.");
  const rev = [...n].reverse().join("");
  return n === rev ? `Yes — palindrome.\nNormalized: ${n}` : `No — not a palindrome.\nNormalized: ${n}\nReversed: ${rev}`;
}

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function under1000En(n: number): string {
  if (n < 20) return ONES[n]!;
  if (n < 100) return TENS[Math.floor(n / 10)]! + (n % 10 ? "-" + ONES[n % 10] : "");
  const h = Math.floor(n / 100), r = n % 100;
  return ONES[h]! + " hundred" + (r ? " " + under1000En(r) : "");
}
function numberToWordsEn(n: number): string {
  if (n === 0) return "zero";
  if (n < 0 || n > 999_999_999 || !Number.isInteger(n)) throw new Error("Enter an integer from 0 to 999,999,999.");
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions) parts.push(under1000En(millions) + (millions === 1 ? " million" : " million"));
  if (thousands) parts.push(under1000En(thousands) + " thousand");
  if (rest) parts.push(under1000En(rest));
  return parts.join(" ");
}

const ONES_ES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const TENS_ES = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const HUND_ES = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
function under100Es(n: number): string {
  if (n < 20) return ONES_ES[n]!;
  if (n === 20) return "veinte";
  if (n < 30) return "veinti" + (n === 21 ? "uno" : ONES_ES[n % 10]);
  const t = Math.floor(n / 10), r = n % 10;
  return r ? `${TENS_ES[t]} y ${ONES_ES[r]}` : TENS_ES[t]!;
}
function under1000Es(n: number): string {
  if (n === 100) return "cien";
  if (n < 100) return under100Es(n);
  const h = Math.floor(n / 100), r = n % 100;
  return r ? `${HUND_ES[h]} ${under100Es(r)}` : h === 1 ? "ciento" : HUND_ES[h]!;
}
function numberToWordsEs(n: number): string {
  if (n === 0) return "cero";
  if (n < 0 || n > 999_999_999 || !Number.isInteger(n)) throw new Error("Ingresá un entero de 0 a 999.999.999.");
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions === 1) parts.push("un millón");
  else if (millions > 1) parts.push(`${under1000Es(millions)} millones`);
  if (thousands === 1) parts.push("mil");
  else if (thousands > 1) parts.push(`${under1000Es(thousands)} mil`);
  if (rest) parts.push(under1000Es(rest));
  return parts.join(" ");
}

export function processGapText(slug: string, text: string, second: string, locale: "en" | "es" = "en"): string {
  switch (slug) {
    case "codigo-morse": {
      const trimmed = text.trim();
      if (!trimmed) throw new Error("Enter text or Morse code.");
      return looksLikeMorse(trimmed) ? fromMorse(trimmed) : toMorse(trimmed);
    }
    case "texto-binario": {
      const trimmed = text.trim();
      if (!trimmed) throw new Error("Enter text or binary.");
      const cleanBits = trimmed.replace(/\s+/g, "");
      if (/^[01]+$/.test(cleanBits)) {
        if (cleanBits.length % 8 !== 0) {
          throw new Error("Binary must be groups of 0/1 with length multiple of 8.");
        }
        return binaryToText(trimmed);
      }
      return textToBinary(trimmed);
    }
    case "frecuencia-palabras":
      return wordFrequency(text);
    case "nivel-lectura":
      return readingLevel(text);
    case "anagramas":
      return anagramCheck(text, second);
    case "palindromo":
      return palindromeCheck(text);
    case "numeros-a-palabras": {
      const raw = text.trim().replace(/[,\s]/g, "");
      if (!/^\d+$/.test(raw)) throw new Error(locale === "es" ? "Ingresá solo dígitos." : "Enter digits only.");
      const n = Number(raw);
      return locale === "es" ? numberToWordsEs(n) : numberToWordsEn(n);
    }
    default:
      throw new Error(`Gap text tool not implemented: ${slug}`);
  }
}

export const GAP_TEXT_SLUGS = new Set([
  "codigo-morse",
  "texto-binario",
  "frecuencia-palabras",
  "nivel-lectura",
  "anagramas",
  "palindromo",
  "numeros-a-palabras",
]);
