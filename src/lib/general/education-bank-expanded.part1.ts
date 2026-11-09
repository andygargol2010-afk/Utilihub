// Part 1 of 3 — split from education-bank-expanded.ts on 2026-11-04. Edit here; education-bank-expanded.ts re-exports.
import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";
import { EDUCATION_BANK_A_REAL } from "./education-bank-a/index";
import { MAPAS } from "./education-bank-b-real";
import { EDUCATION_BANK_RELIEVE } from "./education-bank-b-relieve";
import type { EducationDifficulty, EducationLevel } from "./education-engine";
import { type CoveredQ } from "./education-bank-coverage";

export type Q = CoveredQ;
export type BaseQ = {
  text: string;
  options: string[];
  answer: string;
  levels?: EducationLevel[];
  difficulty?: EducationDifficulty;
};

export const LEGACY_BANK: Record<string, BaseQ[]> = { ...EDUCATION_BANK_A, ...EDUCATION_BANK_B };
export const REAL_BANK: Record<string, BaseQ[]> = {
  ...EDUCATION_BANK_A_REAL,
  mapas: MAPAS,
  relieve: EDUCATION_BANK_RELIEVE,
};
export const LEVELS: EducationLevel[] = ["primaria", "secundaria", "universidad"];
export const DIFFICULTIES: EducationDifficulty[] = ["facil", "media", "dificil"];
/** Minimum curated questions expected in a “real” hand-authored bank (before coverage padding). */
export const REAL_MIN = 20;

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeRealBank(topic: string, base: BaseQ[]): Q[] {
  if (base.length < REAL_MIN) {
    throw new Error(`Real bank incomplete: ${topic} has ${base.length}, required at least ${REAL_MIN}`);
  }
  const seen = new Set<string>();
  return base.map((question, index) => {
    if (!question.text?.trim()) throw new Error(`${topic} #${index + 1}: invalid text`);
    const key = normalize(question.text);
    if (seen.has(key)) throw new Error(`${topic}: duplicate question: ${question.text}`);
    seen.add(key);
    if (question.options.length !== 4 || new Set(question.options.map(normalize)).size !== 4) {
      throw new Error(`${topic} #${index + 1}: invalid options`);
    }
    if (!question.options.map(normalize).includes(normalize(question.answer))) {
      throw new Error(`${topic} #${index + 1}: answer missing from options`);
    }
    if (!question.levels?.length || !LEVELS.includes(question.levels[0])) {
      throw new Error(`${topic} #${index + 1}: invalid level`);
    }
    if (!question.difficulty || !DIFFICULTIES.includes(question.difficulty)) {
      throw new Error(`${topic} #${index + 1}: invalid difficulty`);
    }
    return {
      id: `${topic}-${index + 1}`,
      text: question.text,
      options: [...question.options],
      answer: question.answer,
      levels: question.levels,
      difficulty: question.difficulty,
    };
  });
}
