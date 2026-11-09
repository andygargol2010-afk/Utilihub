// Part 2 of 3 — split from SodCalculatorTool.tsx on 2026-11-04. Edit here; SodCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Shape = "rect" | "area";
export type PresetId = "us" | "metric" | "half" | "slope";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

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
  id: PresetId;
  unit: Unit;
  rollL: string;
  rollW: string;
  waste: string;
  perPallet: string;
};

export const PRESETS: Preset[] = [
  { id: "us", unit: "ft", rollL: "5", rollW: "2", waste: "8", perPallet: "50" },
  { id: "metric", unit: "m", rollL: "2.5", rollW: "0.4", waste: "8", perPallet: "50" },
  { id: "half", unit: "m", rollL: "1.25", rollW: "0.4", waste: "8", perPallet: "80" },
  { id: "slope", unit: "m", rollL: "2.5", rollW: "0.4", waste: "15", perPallet: "50" },
];
