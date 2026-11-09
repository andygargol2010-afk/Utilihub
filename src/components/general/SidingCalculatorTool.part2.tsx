// Part 2 of 3 — split from SidingCalculatorTool.tsx on 2026-11-04. Edit here; SidingCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Layout = "walls" | "area";
export type PresetId = "d4" | "d5" | "metric";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
export const SQUARE_M2 = 9.290304;

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
  walls: string;
  openings: string;
  exposure: string;
  panelL: string;
  waste: string;
  starterL: string;
  jPerimeter: string;
  jL: string;
  corners: string;
  cornerL: string;
};

export const PRESETS: Preset[] = [
  { id: "d4", unit: "ft", length: "40", height: "8", walls: "4", openings: "80", exposure: "0.667", panelL: "12.5", waste: "10", starterL: "12", jPerimeter: "48", jL: "12.5", corners: "4", cornerL: "10" },
  { id: "d5", unit: "ft", length: "32", height: "9", walls: "4", openings: "64", exposure: "0.833", panelL: "12", waste: "10", starterL: "12", jPerimeter: "40", jL: "12", corners: "4", cornerL: "10" },
  { id: "metric", unit: "m", length: "10", height: "2.5", walls: "4", openings: "6", exposure: "0.203", panelL: "3.66", waste: "10", starterL: "3.66", jPerimeter: "12", jL: "3.66", corners: "4", cornerL: "3" },
];
