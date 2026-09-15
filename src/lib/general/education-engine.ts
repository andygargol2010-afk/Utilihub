export type EducationLevel = "primaria" | "secundaria" | "universidad";
export type EducationDifficulty = "facil" | "media" | "dificil";
export type GeneratedQuestion = { text: string; options: string[]; answer: number };

type Q = {
  text: string;
  options: string[];
  answer: string;
  levels: EducationLevel[];
  difficulty: EducationDifficulty;
};

import { EDUCATION_BANK_EXPANDED } from "./education-bank-expanded";

const BANK: Record<string, Q[]> = EDUCATION_BANK_EXPANDED;
const MAX_QUESTIONS = 20;

function shuffle<T>(items: T[]) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeKey(text: string) {
  return text
    .trim()
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function uniqueQuestions(items: Q[]): Q[] {
  const seen = new Set<string>();
  const out: Q[] = [];
  for (const item of items) {
    const key = normalizeKey(item.text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

/**
 * Strict selection: only questions that match BOTH the requested level and
 * difficulty. Never pads with mismatched items — if the bank has fewer than
 * requested, the caller receives a shorter list (and the UI should report it).
 */
function selectQuestions(
  bank: Q[],
  level: EducationLevel,
  difficulty: EducationDifficulty,
  total: number,
) {
  const matching = bank.filter(
    (q) => q.difficulty === difficulty && q.levels.includes(level),
  );
  return uniqueQuestions(shuffle(matching)).slice(0, total);
}

export type GenerateEducationTestResult = {
  questions: GeneratedQuestion[];
  /** How many the user asked for (clamped 1–20). */
  requested: number;
  /** How many match level+difficulty in the bank (before clamp to requested). */
  available: number;
};

export function generateEducationTest(
  topic: string,
  level: EducationLevel,
  difficulty: EducationDifficulty,
  count: number,
): GenerateEducationTestResult {
  const bank = uniqueQuestions(BANK[topic] ?? []);
  const requestedRaw = Math.trunc(Number(count));
  const requested = Math.max(
    1,
    Math.min(MAX_QUESTIONS, Number.isFinite(requestedRaw) && requestedRaw > 0 ? requestedRaw : 10),
  );

  if (!bank.length) {
    return { questions: [], requested, available: 0 };
  }

  const matching = bank.filter(
    (q) => q.difficulty === difficulty && q.levels.includes(level),
  );
  const available = uniqueQuestions(matching).length;
  const selected = selectQuestions(bank, level, difficulty, Math.min(requested, available));

  const questions = selected.map((source) => {
    const options = shuffle([...source.options]);
    // Match answer by normalized text so minor case/accent differences don't break scoring
    const answerKey = normalizeKey(source.answer);
    let answer = options.findIndex((o) => normalizeKey(o) === answerKey);
    if (answer < 0) answer = options.indexOf(source.answer);
    return { text: source.text, options, answer: answer < 0 ? 0 : answer };
  });

  return { questions, requested, available };
}

/** @deprecated Prefer generateEducationTest which returns metadata. Kept for any old call sites. */
export function generateEducationTestQuestions(
  topic: string,
  level: EducationLevel,
  difficulty: EducationDifficulty,
  count: number,
): GeneratedQuestion[] {
  return generateEducationTest(topic, level, difficulty, count).questions;
}

export const EDUCATION_MAX_QUESTIONS = MAX_QUESTIONS;
