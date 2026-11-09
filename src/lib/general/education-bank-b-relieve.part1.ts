// Part 1 of 3 — split from education-bank-b-relieve.ts on 2026-11-04. Edit here; education-bank-b-relieve.ts re-exports.
import type { EducationDifficulty, EducationLevel } from "./education-engine";

export type Q = { text: string; options: string[]; answer: string; levels: EducationLevel[]; difficulty: EducationDifficulty };
export const q = (text: string, options: string[], answer: string, levels: EducationLevel[], difficulty: EducationDifficulty): Q => ({ text, options, answer, levels, difficulty });
