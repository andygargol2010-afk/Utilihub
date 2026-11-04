// Part 2 of 3 — split from DrywallCalculatorTool.tsx on 2026-11-04. Edit here; DrywallCalculatorTool.tsx re-exports.

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

export type Preset = {
  id: string;
  length: string;
  height: string;
  openings: string;
  ceiling: boolean;
  depth: string;
  widthCm: string;
  lengthCm: string;
  layers: string;
  waste: string;
};
