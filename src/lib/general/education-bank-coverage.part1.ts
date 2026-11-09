// Part 1 of 3 — split from education-bank-coverage.ts on 2026-11-04. Edit here; education-bank-coverage.ts re-exports.
import type { EducationDifficulty, EducationLevel } from "./education-engine";

export type CoveredQ = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  levels: EducationLevel[];
  difficulty: EducationDifficulty;
};

export const LEVELS: EducationLevel[] = ["primaria", "secundaria", "universidad"];
export const DIFFICULTIES: EducationDifficulty[] = ["facil", "media", "dificil"];
export const COVERAGE_PER_BUCKET = 20;

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

export function distractorsAround(correct: number, spread: number, count: number, rng: () => number): number[] {
  const out = new Set<number>([correct]);
  let guard = 0;
  while (out.size < count + 1 && guard < 80) {
    const delta = Math.max(1, Math.round((rng() * 2 - 1) * spread));
    out.add(correct + delta);
    guard++;
  }
  return [...out].filter((n) => n !== correct).slice(0, count);
}

export function optionsFrom(correct: string, wrongs: string[]): { options: string[]; answer: string } {
  const options = [correct, ...wrongs].slice(0, 4);
  // stable unique
  const seen = new Set<string>();
  const unique = options.filter((o) => {
    const k = normalize(o);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  while (unique.length < 4) unique.push(`Option ${unique.length + 1}`);
  return { options: unique, answer: correct };
}
