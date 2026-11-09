// Part 2 of 3 — split from BrickCalculatorTool.tsx on 2026-11-04. Edit here; BrickCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Layout = "wall" | "area";
export type PresetId = "modular" | "solid" | "hollow" | "uk";

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
  layout: Layout;
  length: string;
  height: string;
  openings: string;
  brickL: string;
  brickH: string;
  brickD: string;
  joint: string;
  waste: string;
  bagYield: string;
};

export const PRESETS: Preset[] = [
  { id: "modular", unit: "ft", layout: "wall", length: "20", height: "8", openings: "20", brickL: "7.625", brickH: "2.25", brickD: "3.625", joint: "0.375", waste: "10", bagYield: "0.65" },
  { id: "solid", unit: "m", layout: "wall", length: "5", height: "2.5", openings: "1.5", brickL: "24", brickH: "5.2", brickD: "11.5", joint: "1", waste: "8", bagYield: "0.015" },
  { id: "hollow", unit: "m", layout: "wall", length: "6", height: "2.6", openings: "2", brickL: "24", brickH: "11.5", brickD: "11.5", joint: "1", waste: "8", bagYield: "0.015" },
  { id: "uk", unit: "m", layout: "wall", length: "5", height: "2.4", openings: "1.2", brickL: "21.5", brickH: "6.5", brickD: "10.25", joint: "1", waste: "10", bagYield: "0.015" },
];
