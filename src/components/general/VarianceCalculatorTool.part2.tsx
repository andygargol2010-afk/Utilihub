// Part 2 of 3 — split from VarianceCalculatorTool.tsx on 2026-11-04. Edit here; VarianceCalculatorTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function parseNumbers(raw: string): number[] {
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n) && Number.isFinite(n));
}

export function mean(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function variance(nums: number[], sample: boolean) {
  if (nums.length < (sample ? 2 : 1)) return null;
  const m = mean(nums);
  const sumSq = nums.reduce((acc, n) => acc + (n - m) ** 2, 0);
  const denom = sample ? nums.length - 1 : nums.length;
  return sumSq / denom;
}
