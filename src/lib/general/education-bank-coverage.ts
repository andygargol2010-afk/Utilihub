import type { EducationDifficulty, EducationLevel } from "./education-engine";
import { type CoveredQ, COVERAGE_PER_BUCKET, normalize, LEVELS, DIFFICULTIES } from "./education-bank-coverage.part1";
import { generateParametric } from "./education-bank-coverage.part2";
export { COVERAGE_PER_BUCKET } from "./education-bank-coverage.part1";
export type { CoveredQ } from "./education-bank-coverage.part1";

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
