// Part 2 of 3 — split from FirewoodCalculatorTool.tsx on 2026-11-04. Edit here; FirewoodCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Shape = "stack" | "volume";
export type Species = "oak" | "birch" | "maple" | "pine" | "mixed" | "custom";
export type Moisture = "seasoned" | "green";
export type PresetId = "half" | "face" | "stere" | "loose";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

/** Seasoned solid-wood density, kg per cubic meter. */
export const DENSITY: Record<Exclude<Species, "custom">, number> = {
  oak: 720,
  birch: 640,
  maple: 680,
  pine: 450,
  mixed: 600,
};

export const CORD_M3 = 3.62455636378;
export const M_PER_FT = 0.3048;
export const GREEN_FACTOR = 1.4;

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
  depth: string;
  volume: string;
  species: Species;
  solid: string;
  moisture: Moisture;
};

export const PRESETS: Preset[] = [
  { id: "half", unit: "ft", length: "8", height: "4", depth: "2", volume: "64", species: "oak", solid: "65", moisture: "seasoned" },
  { id: "face", unit: "ft", length: "8", height: "4", depth: "1.333", volume: "42.7", species: "mixed", solid: "65", moisture: "seasoned" },
  { id: "stere", unit: "m", length: "2", height: "1", depth: "0.5", volume: "1", species: "birch", solid: "65", moisture: "seasoned" },
  { id: "loose", unit: "m", length: "3", height: "1.5", depth: "0.4", volume: "1.8", species: "pine", solid: "50", moisture: "green" },
];
