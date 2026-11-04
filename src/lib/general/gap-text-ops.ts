import { looksLikeMorse, fromMorse, toMorse, binaryToText, textToBinary, wordFrequency } from "./gap-text-ops.part1";
import { readingLevel, anagramCheck, palindromeCheck, numberToWordsEn } from "./gap-text-ops.part2";

const ONES_ES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const TENS_ES = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const VEINTI_ES = ["veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const HUND_ES = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];
function under100Es(n: number): string {
  if (n < 20) return ONES_ES[n]!;
  if (n === 20) return "veinte";
  if (n < 30) return VEINTI_ES[n - 21]!;
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
