import { COVERAGE_PER_BUCKET, ensureBucketCoverage } from "./education-bank-coverage";
import { type BaseQ, type Q, normalize, LEGACY_BANK, REAL_BANK, normalizeRealBank, LEVELS, DIFFICULTIES } from "./education-bank-expanded.part1";
import { legacyCandidates, legacyMetadata } from "./education-bank-expanded.part2";

function buildLegacyBank(topic: string, base: BaseQ[]): Q[] {
  const result: Q[] = [];
  const seen = new Set<string>();
  for (const candidate of legacyCandidates(base)) {
    const key = normalize(candidate.text);
    if (seen.has(key)) continue;
    seen.add(key);
    if (candidate.options.length !== 4 || new Set(candidate.options.map(normalize)).size !== 4) {
      throw new Error(`${topic}: invalid options in legacy bank`);
    }
    if (!candidate.options.map(normalize).includes(normalize(candidate.answer))) {
      throw new Error(`${topic}: answer missing in legacy bank`);
    }
    result.push({
      id: `${topic}-${result.length + 1}`,
      text: candidate.text,
      options: [...candidate.options],
      answer: candidate.answer,
      ...legacyMetadata(topic, result.length, candidate),
    });
  }
  if (!result.length) throw new Error(`Legacy bank empty: ${topic}`);
  return result;
}

function finalizeTopic(topic: string, curated: Q[]): Q[] {
  return ensureBucketCoverage(topic, curated, COVERAGE_PER_BUCKET);
}

const TOPICS = new Set([...Object.keys(LEGACY_BANK), ...Object.keys(REAL_BANK)]);

export const EDUCATION_BANK_EXPANDED: Record<string, Q[]> = Object.fromEntries(
  [...TOPICS].map((topic) => {
    const curated = REAL_BANK[topic]
      ? normalizeRealBank(topic, REAL_BANK[topic])
      : buildLegacyBank(topic, LEGACY_BANK[topic]);
    return [topic, finalizeTopic(topic, curated)];
  }),
);

export function educationBankSize(topic: string) {
  return EDUCATION_BANK_EXPANDED[topic]?.length ?? 0;
}

export const EDUCATION_BANK_TARGET = COVERAGE_PER_BUCKET * LEVELS.length * DIFFICULTIES.length;
export { COVERAGE_PER_BUCKET };
