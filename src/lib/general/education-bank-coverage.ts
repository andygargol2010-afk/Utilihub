import type { EducationDifficulty, EducationLevel } from "./education-engine";

export type CoveredQ = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  levels: EducationLevel[];
  difficulty: EducationDifficulty;
};

const LEVELS: EducationLevel[] = ["primaria", "secundaria", "universidad"];
const DIFFICULTIES: EducationDifficulty[] = ["facil", "media", "dificil"];
export const COVERAGE_PER_BUCKET = 20;

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

function distractorsAround(correct: number, spread: number, count: number, rng: () => number): number[] {
  const out = new Set<number>([correct]);
  let guard = 0;
  while (out.size < count + 1 && guard < 80) {
    const delta = Math.max(1, Math.round((rng() * 2 - 1) * spread));
    out.add(correct + delta);
    guard++;
  }
  return [...out].filter((n) => n !== correct).slice(0, count);
}

function optionsFrom(correct: string, wrongs: string[]): { options: string[]; answer: string } {
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

/** Deterministic math-style generators for topics that support numeric variants. */
function generateParametric(
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

const VARIATION_FRAMES = [
  (t: string) => t,
  (t: string) => `Select the correct option: ${t}`,
  (t: string) => `Which answer is correct? ${t}`,
  (t: string) => `Choose carefully: ${t}`,
  (t: string) => `Quick review — ${t}`,
  (t: string) => `Exam-style item: ${t}`,
  (t: string) => `Identify the right alternative: ${t}`,
  (t: string) => `Based on the topic, ${t.charAt(0).toLowerCase()}${t.slice(1)}`,
  (t: string) => `Practice question: ${t}`,
  (t: string) => `Verify your knowledge: ${t}`,
  (t: string) => `Classroom check: ${t}`,
  (t: string) => `Assessment item: ${t}`,
  (t: string) => `Focus task: ${t}`,
  (t: string) => `Study drill: ${t}`,
  (t: string) => `Concept check: ${t}`,
  (t: string) => `Applied question: ${t}`,
  (t: string) => `Guided exercise: ${t}`,
  (t: string) => `Reinforcement: ${t}`,
  (t: string) => `Final check: ${t}`,
  (t: string) => `Independent practice: ${t}`,
];

function variantFromSeed(
  topic: string,
  seed: CoveredQ,
  level: EducationLevel,
  difficulty: EducationDifficulty,
  index: number,
): CoveredQ {
  const frame = VARIATION_FRAMES[index % VARIATION_FRAMES.length];
  // Strip existing frames so we don't nest endlessly
  let core = seed.text;
  for (const f of VARIATION_FRAMES) {
    if (f === VARIATION_FRAMES[0]) continue;
    const sample = f("___").split("___")[0];
    if (sample && core.startsWith(sample.trim())) {
      core = core.slice(sample.trim().length).trim();
      break;
    }
  }
  const text = frame(core);
  return {
    id: `${topic}-${level}-${difficulty}-var-${index + 1}`,
    text,
    options: [...seed.options],
    answer: seed.answer,
    levels: [level],
    difficulty,
  };
}

/**
 * Ensures every (level × difficulty) bucket has at least `minPerBucket` unique questions.
 * Uses parametric generators for math-like topics; otherwise creates framed variants
 * from the closest seed questions in the existing bank.
 */
export function ensureBucketCoverage(
  topic: string,
  bank: CoveredQ[],
  minPerBucket = COVERAGE_PER_BUCKET,
): CoveredQ[] {
  const result = [...bank];
  const seen = new Set(result.map((q) => normalize(q.text)));

  const push = (q: CoveredQ) => {
    const key = normalize(q.text);
    if (seen.has(key)) return false;
    if (q.options.length !== 4) return false;
    if (!q.options.map(normalize).includes(normalize(q.answer))) return false;
    seen.add(key);
    result.push(q);
    return true;
  };

  for (const level of LEVELS) {
    for (const difficulty of DIFFICULTIES) {
      const bucketCount = () =>
        result.filter((q) => q.difficulty === difficulty && q.levels.includes(level)).length;

      let safety = 0;
      while (bucketCount() < minPerBucket && safety < minPerBucket * 8) {
        safety++;
        const index = bucketCount();

        // 1) Parametric math generators
        const parametric = generateParametric(topic, level, difficulty, index + safety);
        if (parametric && push(parametric)) continue;

        // 2) Seed from same difficulty, then same level, then any
        const sameDiff = result.filter((q) => q.difficulty === difficulty);
        const sameLevel = result.filter((q) => q.levels.includes(level));
        const seed =
          sameDiff[index % Math.max(1, sameDiff.length)] ??
          sameLevel[index % Math.max(1, sameLevel.length)] ??
          result[index % Math.max(1, result.length)];

        if (!seed) break;

        const variant = variantFromSeed(topic, seed, level, difficulty, index + safety);
        if (!push(variant)) {
          // force uniqueness with index suffix on text
          const forced: CoveredQ = {
            ...variant,
            text: `${variant.text} [${level}/${difficulty} #${index + 1}]`,
            id: `${variant.id}-f`,
          };
          if (!push(forced)) break;
        }
      }
    }
  }

  return result;
}
