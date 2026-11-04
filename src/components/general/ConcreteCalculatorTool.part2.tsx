// Part 2 of 3 — split from ConcreteCalculatorTool.tsx on 2026-11-04. Edit here; ConcreteCalculatorTool.tsx re-exports.

export type Shape = "slab" | "column";
export type MixId = "lean" | "standard" | "rich";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const chipClass = "h-11 rounded-xl border px-3 text-sm";

export const MIXES: Record<MixId, { cement: number; sand: number; gravel: number }> = {
  lean: { cement: 1, sand: 3, gravel: 5 },
  standard: { cement: 1, sand: 2, gravel: 3 },
  rich: { cement: 1, sand: 1.5, gravel: 3 },
};

export const DRY_FACTOR = 1.54;
export const CEMENT_DENSITY = 1440;

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}
