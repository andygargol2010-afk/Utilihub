// Part 2 of 3 — split from AirFryerCalculatorTool.tsx on 2026-11-04. Edit here; AirFryerCalculatorTool.tsx re-exports.

export type Direction = "oven-to-air" | "air-to-oven";
export type Unit = "C" | "F";
export type PresetId = "general" | "fries" | "veg" | "chicken" | "fish" | "bake" | "frozen" | "reheat";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatNum(value: number, digits = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

export function cToF(c: number) {
  return (c * 9) / 5 + 32;
}

export function fToC(f: number) {
  return ((f - 32) * 5) / 9;
}

export type Preset = {
  id: PresetId;
  deltaC: number;
  factor: number;
};

export const PRESETS: Preset[] = [
  { id: "general", deltaC: 20, factor: 0.8 },
  { id: "fries", deltaC: 20, factor: 0.75 },
  { id: "veg", deltaC: 15, factor: 0.75 },
  { id: "chicken", deltaC: 15, factor: 0.8 },
  { id: "fish", deltaC: 20, factor: 0.7 },
  { id: "bake", deltaC: 20, factor: 0.8 },
  { id: "frozen", deltaC: 20, factor: 0.85 },
  { id: "reheat", deltaC: 20, factor: 0.5 },
];
