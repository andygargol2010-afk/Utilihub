// Part 2 of 3 — split from RaisedBedCalculatorTool.tsx on 2026-11-04. Edit here; RaisedBedCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type PresetId = "veg" | "deep" | "herbs" | "imperial";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const CUFT_PER_M3 = 35.314666721;
export const L_PER_M3 = 1000;

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
  length: string;
  width: string;
  height: string;
  beds: string;
  compost: string;
  bag: string;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "veg", unit: "m", length: "1.2", width: "0.8", height: "0.3", beds: "1", compost: "30", bag: "50", waste: "10" },
  { id: "deep", unit: "m", length: "2.4", width: "1.2", height: "0.45", beds: "1", compost: "30", bag: "50", waste: "10" },
  { id: "herbs", unit: "m", length: "1", width: "0.4", height: "0.2", beds: "2", compost: "20", bag: "25", waste: "5" },
  { id: "imperial", unit: "ft", length: "8", width: "4", height: "1", beds: "1", compost: "30", bag: "2", waste: "10" },
];
