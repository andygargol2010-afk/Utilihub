// Part 2 of 3 — split from education-bank-coverage.ts on 2026-11-04. Edit here; education-bank-coverage.ts re-exports.
import type { EducationDifficulty, EducationLevel } from "./education-engine";
import { type CoveredQ, LEVELS, DIFFICULTIES, mulberry32, pick, distractorsAround, optionsFrom } from "./education-bank-coverage.part1";

/** Deterministic math-style generators for topics that support numeric variants. */
export function generateParametric(
  topic: string,
  level: EducationLevel,
  difficulty: EducationDifficulty,
  index: number,
): CoveredQ | null {
  const seed = topic.length * 1000 + LEVELS.indexOf(level) * 100 + DIFFICULTIES.indexOf(difficulty) * 20 + index;
  const rng = mulberry32(seed);
  const id = `${topic}-${level}-${difficulty}-gen-${index + 1}`;

  const scale =
    difficulty === "facil" ? 1 : difficulty === "media" ? 2 : 3;
  const levelBoost = level === "primaria" ? 1 : level === "secundaria" ? 2 : 3;

  if (topic === "aritmetica") {
    const a = 5 + Math.floor(rng() * 20 * scale * levelBoost);
    const b = 3 + Math.floor(rng() * 15 * scale);
    const ops: Array<["+", number] | ["−", number] | ["×", number] | ["÷", number]> = [
      ["+", a + b],
      ["−", a - b],
      ["×", a * Math.max(2, Math.min(12, b))],
    ];
    if (b !== 0 && a % b === 0) ops.push(["÷", a / b]);
    const [op, correctNum] = pick(rng, ops);
    const left = op === "×" ? a : a;
    const right = op === "×" ? Math.max(2, Math.min(12, b)) : b;
    const correct = String(correctNum);
    const wrongNums = distractorsAround(correctNum, 5 + scale * 3, 3, rng).map(String);
    const { options, answer } = optionsFrom(correct, wrongNums);
    return {
      id,
      text: `What is ${left} ${op} ${right}?`,
      options,
      answer,
      levels: [level],
      difficulty,
    };
  }

  if (topic === "algebra") {
    const x = 2 + Math.floor(rng() * 8 * scale);
    const c = 1 + Math.floor(rng() * 12 * scale);
    const k = 2 + Math.floor(rng() * 5 * levelBoost);
    const modes = [
      {
        text: `If ${k}x = ${k * x}, what is the value of x?`,
        correct: String(x),
      },
      {
        text: `If x + ${c} = ${x + c}, what is the value of x?`,
        correct: String(x),
      },
      {
        text: `What is the value of ${k}x + ${c} when x = ${x}?`,
        correct: String(k * x + c),
      },
      {
        text: `Solve ${k}(x − ${Math.min(x, c)}) = ${k * (x - Math.min(x, c))}. What is x?`,
        correct: String(x),
      },
    ];
    const mode = pick(rng, modes);
    const correctNum = Number(mode.correct);
    const wrongNums = distractorsAround(correctNum, 4 + scale * 2, 3, rng).map(String);
    const { options, answer } = optionsFrom(mode.correct, wrongNums);
    return { id, text: mode.text, options, answer, levels: [level], difficulty };
  }

  if (topic === "geometria") {
    const side = 3 + Math.floor(rng() * 10 * scale);
    const modes = [
      {
        text: `What is the perimeter of a square with side ${side} cm?`,
        correct: `${side * 4} cm`,
        wrongs: [`${side * 2} cm`, `${side * 3} cm`, `${side * side} cm`],
      },
      {
        text: `What is the area of a square with side ${side} cm?`,
        correct: `${side * side} cm²`,
        wrongs: [`${side * 4} cm²`, `${side * 2} cm²`, `${side * side * 2} cm²`],
      },
      {
        text: `What is the area of a rectangle ${side} cm by ${side + 2} cm?`,
        correct: `${side * (side + 2)} cm²`,
        wrongs: [`${side + (side + 2)} cm²`, `${2 * (side + side + 2)} cm²`, `${side * side} cm²`],
      },
    ];
    const mode = pick(rng, modes);
    const { options, answer } = optionsFrom(mode.correct, mode.wrongs);
    return { id, text: mode.text, options, answer, levels: [level], difficulty };
  }

  if (topic === "estadistica") {
    const n1 = 4 + Math.floor(rng() * 10 * scale);
    const n2 = 4 + Math.floor(rng() * 10 * scale);
    const n3 = 4 + Math.floor(rng() * 10 * scale);
    const mean = (n1 + n2 + n3) / 3;
    const meanStr = Number.isInteger(mean) ? String(mean) : mean.toFixed(2).replace(/\.?0+$/, "");
    const modes = [
      {
        text: `What is the average of ${n1}, ${n2} and ${n3}?`,
        correct: meanStr,
        wrongs: [String(n1 + n2 + n3), String(Math.max(n1, n2, n3)), String(Math.min(n1, n2, n3))],
      },
      {
        text: `What is the range of ${n1}, ${n2} and ${n3}?`,
        correct: String(Math.max(n1, n2, n3) - Math.min(n1, n2, n3)),
        wrongs: [String(n1 + n2 + n3), meanStr, String(Math.max(n1, n2, n3))],
      },
    ];
    const mode = pick(rng, modes);
    const { options, answer } = optionsFrom(mode.correct, mode.wrongs);
    return { id, text: mode.text, options, answer, levels: [level], difficulty };
  }

  if (topic === "porcentaje" || topic.includes("porcent")) {
    const base = 40 + Math.floor(rng() * 80 * scale);
    const pct = [5, 10, 15, 20, 25, 30, 40, 50][Math.floor(rng() * 8)];
    const correctNum = (base * pct) / 100;
    const correct = String(correctNum);
    const wrongNums = distractorsAround(correctNum, 10, 3, rng).map(String);
    const { options, answer } = optionsFrom(correct, wrongNums);
    return {
      id,
      text: `What is ${pct}% of ${base}?`,
      options,
      answer,
      levels: [level],
      difficulty,
    };
  }

  return null;
}
