// Part 2 of 3 — split from RoofCalculatorTool.tsx on 2026-11-04. Edit here; RoofCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const FT_PER_M = 3.280839895;
export const SQFT_PER_M2 = FT_PER_M * FT_PER_M;
export const SQUARE_FT2 = 100;

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

export type Preset = {
  id: string;
  unit: Unit;
  length: string;
  width: string;
  rise: string;
  run: string;
  extra: string;
  waste: string;
  bundles: string;
  ridge: string;
  ridgeCover: string;
};

export const PRESETS: Preset[] = [
  { id: "gable", unit: "m", length: "12", width: "8", rise: "6", run: "12", extra: "0", waste: "10", bundles: "3", ridge: "12", ridgeCover: "10" },
  { id: "hip", unit: "m", length: "14", width: "10", rise: "4", run: "12", extra: "0", waste: "15", bundles: "3", ridge: "24", ridgeCover: "10" },
  { id: "arch", unit: "ft", length: "40", width: "28", rise: "8", run: "12", extra: "0", waste: "12", bundles: "4", ridge: "40", ridgeCover: "35" },
  { id: "steep", unit: "m", length: "10", width: "7", rise: "12", run: "12", extra: "2", waste: "15", bundles: "3", ridge: "10", ridgeCover: "10" },
];
