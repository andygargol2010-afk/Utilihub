// Part 2 of 3 — split from education-bank-expanded.ts on 2026-11-04. Edit here; education-bank-expanded.ts re-exports.
import { type BaseQ, LEVELS, DIFFICULTIES } from "./education-bank-expanded.part1";

export function legacyMetadata(topic: string, index: number, base: BaseQ) {
  return {
    levels: base.levels?.length ? base.levels : [LEVELS[index % 3]],
    difficulty: base.difficulty ?? DIFFICULTIES[(index + topic.length) % 3],
  };
}

export function legacyCandidates(base: BaseQ[]): BaseQ[] {
  const prompts = [
    "Select the correct answer:",
    "Which option best answers the statement?",
    "Identify the correct answer:",
    "Which statement matches the prompt?",
    "Choose the correct alternative:",
    "Which is the most precise answer?",
    "Determine which statement is correct:",
    "Analyze the prompt and select:",
    "Which alternative matches what is asked?",
    "Recognize the matching option:",
    "Select the alternative that best explains the prompt:",
    "Which answer is compatible with the question?",
    "Examine the options and choose the correct one:",
    "Which option correctly represents the idea stated?",
    "Identify which alternative is valid:",
    "Choose the answer that matches exactly:",
    "Solve this exercise:",
    "Consider the following case:",
    "Determine the correct result:",
    "Evaluate the setup and select:",
  ];
  return base.flatMap((question) =>
    prompts.map((prefix) => ({
      ...question,
      text: `${prefix} ${question.text}`,
      options: [...question.options],
    })),
  );
}
