// Part 2 of 3 — split from gap-text-ops.ts on 2026-11-04. Edit here; gap-text-ops.ts re-exports.
import { countSyllablesEs, countSyllablesEn } from "./gap-text-ops.part1";

export function readingLevel(text: string) {
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

export function normalizeLetters(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function anagramCheck(a: string, b: string) {
  if (!a.trim() || !b.trim()) throw new Error("Enter two words or phrases.");
  const na = normalizeLetters(a).split("").sort().join("");
  const nb = normalizeLetters(b).split("").sort().join("");
  if (!na || !nb) throw new Error("Enter two words or phrases.");
  return na === nb ? `Yes — anagrams.\nA: ${a.trim()}\nB: ${b.trim()}` : `No — not anagrams.\nA letters: ${na}\nB letters: ${nb}`;
}

export function palindromeCheck(text: string) {
  if (!text.trim()) throw new Error("Enter some text.");
  const n = normalizeLetters(text);
  if (!n) throw new Error("Enter some text.");
  const rev = [...n].reverse().join("");
  return n === rev ? `Yes — palindrome.\nNormalized: ${n}` : `No — not a palindrome.\nNormalized: ${n}\nReversed: ${rev}`;
}

export const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
export const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
export function under1000En(n: number): string {
  if (n < 20) return ONES[n]!;
  if (n < 100) return TENS[Math.floor(n / 10)]! + (n % 10 ? "-" + ONES[n % 10] : "");
  const h = Math.floor(n / 100), r = n % 100;
  return ONES[h]! + " hundred" + (r ? " " + under1000En(r) : "");
}
export function numberToWordsEn(n: number): string {
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
