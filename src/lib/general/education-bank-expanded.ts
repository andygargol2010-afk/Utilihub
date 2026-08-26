import { EDUCATION_BANK_A } from "./education-bank-a";
import { EDUCATION_BANK_B } from "./education-bank-b";
import type { EducationDifficulty, EducationLevel } from "./education-engine";

type Q = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  levels: EducationLevel[];
  difficulty: EducationDifficulty;
};

type BaseQ = {
  text: string;
  options: string[];
  answer: string;
  levels?: EducationLevel[];
  difficulty?: EducationDifficulty;
};

const BASE_BANK: Record<string, BaseQ[]> = { ...EDUCATION_BANK_A, ...EDUCATION_BANK_B };

const LEVELS: EducationLevel[] = ["primaria", "secundaria", "universidad"];
const DIFFICULTIES: EducationDifficulty[] = ["facil", "media", "dificil"];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\d+(?:[.,]\d+)?/g, "#")
    .replace(/[^a-z0-9#]+/g, " ")
    .trim();
}

function uniqueOptions(options: string[], answer: string) {
  return [...new Set(options)].filter(Boolean).includes(answer)
    ? [...new Set(options)]
    : [...new Set([...options, answer])];
}

function metadata(topic: string, index: number, base: BaseQ): Pick<Q, "levels" | "difficulty"> {
  if (base.levels?.length && base.difficulty) {
    return { levels: base.levels, difficulty: base.difficulty };
  }
  const level = LEVELS[index % LEVELS.length];
  const difficulty = DIFFICULTIES[(index + topic.length) % DIFFICULTIES.length];
  return { levels: [level], difficulty };
}

/*
 * The old implementation made "20 questions" by adding prefixes such as
 * "Selecciona la respuesta correcta:" to the same question. That is not a
 * real question bank and makes a test look broken.
 *
 * This module therefore keeps only genuinely different source questions. It
 * never manufactures a new question by cosmetically changing the wording.
 * The engine is responsible for enforcing the unique-question limit.
 */
function buildBank(topic: string, base: BaseQ[]): Q[] {
  const result: Q[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < base.length; i++) {
    const question = base[i];
    const options = uniqueOptions(question.options, question.answer);
    const key = `${normalize(question.text)}|${options.map(normalize).join("|")}|${normalize(question.answer)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      id: `${topic}-${i + 1}`,
      text: question.text,
      options,
      answer: question.answer,
      ...metadata(topic, i, question),
    });
  }

  return result;
}

export const EDUCATION_BANK_EXPANDED: Record<string, Q[]> = Object.fromEntries(
  Object.entries(BASE_BANK).map(([topic, bank]) => [topic, buildBank(topic, bank)])
);

export function educationBankSize(topic: string) {
  return EDUCATION_BANK_EXPANDED[topic]?.length ?? 0;
}
