/** Incoherent sound-level sum. Not an arithmetic mean and not a linear add. */

export type DecibelStatus = "empty" | "invalid" | "ok";

export type DecibelResult = {
  status: DecibelStatus;
  levels: number[];
  combined: number | null;
  linearSum: number | null;
  message?: string;
};

const MIN = -200;
const MAX = 200;

export function parseLevels(raw: string): { levels: number[]; bad: string | null } {
  const lines = raw.split(/[\n,;]+/).map((part) => part.trim()).filter(Boolean);
  if (!lines.length) return { levels: [], bad: null };
  const levels: number[] = [];
  for (const line of lines) {
    const value = Number(line.replace(",", "."));
    if (!Number.isFinite(value) || value < MIN || value > MAX) return { levels: [], bad: line };
    levels.push(value);
  }
  return { levels, bad: null };
}

export function combineDecibels(levels: number[]): number {
  const power = levels.reduce((sum, level) => sum + 10 ** (level / 10), 0);
  return 10 * Math.log10(power);
}

export function evaluateDecibels(raw: string): DecibelResult {
  const parsed = parseLevels(raw);
  if (parsed.bad) return { status: "invalid", levels: [], combined: null, linearSum: null, message: parsed.bad };
  if (!parsed.levels.length) return { status: "empty", levels: [], combined: null, linearSum: null };
  const linearSum = parsed.levels.reduce((sum, level) => sum + level, 0);
  return { status: "ok", levels: parsed.levels, combined: combineDecibels(parsed.levels), linearSum };
}

export function formatDb(value: number): string {
  return value.toFixed(2);
}
