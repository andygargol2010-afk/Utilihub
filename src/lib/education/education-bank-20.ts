import type { EducationDifficulty, EducationLevel } from "./education-engine";

export type EducationBankQuestion = {
  text: string;
  options: string[];
  answer: string;
  levels: EducationLevel[];
  difficulty: EducationDifficulty;
};

// This module is intentionally kept separate from the engine. It is the home for
// the 20 genuinely different questions available to each supported topic.
// The current catalog is populated by the education-bank-expanded module.
export const EDUCATION_BANK_20: Record<string, EducationBankQuestion[]> = {};
