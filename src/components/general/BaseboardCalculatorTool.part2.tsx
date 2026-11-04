// Part 2 of 3 — split from BaseboardCalculatorTool.tsx on 2026-11-04. Edit here; BaseboardCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Shape = "rect" | "perimeter";
export type PresetId = "metric" | "bedroom" | "long" | "open";

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
  width: string;
  perimeter: string;
  doors: string;
  doorWidth: string;
  extra: string;
  stick: string;
  waste: string;
  shoe: boolean;
};

export const PRESETS: Preset[] = [
  { id: "metric", unit: "m", length: "4", width: "3", perimeter: "14", doors: "1", doorWidth: "0.8", extra: "0", stick: "2.4", waste: "10", shoe: false },
  { id: "bedroom", unit: "ft", length: "12", width: "10", perimeter: "44", doors: "2", doorWidth: "2.5", extra: "0", stick: "8", waste: "10", shoe: false },
  { id: "long", unit: "ft", length: "16", width: "12", perimeter: "56", doors: "1", doorWidth: "2.67", extra: "0", stick: "12", waste: "10", shoe: true },
  { id: "open", unit: "m", length: "8", width: "5", perimeter: "26", doors: "2", doorWidth: "0.9", extra: "3", stick: "3", waste: "12", shoe: true },
];
