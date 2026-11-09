// Part 2 of 3 — split from StairCalculatorTool.tsx on 2026-11-04. Edit here; StairCalculatorTool.tsx re-exports.

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, locale: string, digits = 1) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

export type Preset = { id: string; rise: string; target: string; tread: string; mode: "minus" | "equal" };

export const PRESETS: Preset[] = [
  { id: "comfort", rise: "280", target: "17.5", tread: "28", mode: "minus" },
  { id: "floor", rise: "270", target: "18", tread: "27", mode: "minus" },
  { id: "attic", rise: "260", target: "20", tread: "22", mode: "minus" },
  { id: "deck", rise: "70", target: "17.5", tread: "28", mode: "equal" },
];
