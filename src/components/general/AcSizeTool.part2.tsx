// Part 2 of 3 — split from AcSizeTool.tsx on 2026-11-04. Edit here; AcSizeTool.tsx re-exports.

export type Sun = "low" | "medium" | "high";
export type Insulation = "good" | "average" | "poor";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

export const SPLITS = [
  { btu: 9000, frig: 2250 },
  { btu: 12000, frig: 3000 },
  { btu: 18000, frig: 4500 },
  { btu: 24000, frig: 6000 },
  { btu: 36000, frig: 9000 },
];

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, digits = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}
