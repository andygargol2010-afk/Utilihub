// Part 2 of 3 — split from StudCalculatorTool.tsx on 2026-11-04. Edit here; StudCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type PresetId = "metric" | "oc16" | "oc24" | "door";

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
  length: string;
  height: string;
  spacing: string;
  plates: string;
  openings: string;
  extra: string;
  corners: string;
  waste: string;
  studStock: string;
  plateStock: string;
};

export const PRESETS: Preset[] = [
  { id: "metric", unit: "m", length: "4", height: "2.4", spacing: "0.4", plates: "3", openings: "0", extra: "4", corners: "0", waste: "10", studStock: "2.4", plateStock: "3" },
  { id: "oc16", unit: "ft", length: "12", height: "8", spacing: "1.333", plates: "3", openings: "0", extra: "4", corners: "2", waste: "10", studStock: "8", plateStock: "12" },
  { id: "oc24", unit: "ft", length: "20", height: "8", spacing: "2", plates: "3", openings: "0", extra: "4", corners: "0", waste: "5", studStock: "8", plateStock: "10" },
  { id: "door", unit: "m", length: "3.2", height: "2.4", spacing: "0.4", plates: "3", openings: "1", extra: "4", corners: "0", waste: "10", studStock: "2.4", plateStock: "3" },
];
