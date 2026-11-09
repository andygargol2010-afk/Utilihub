// Part 2 of 3 — split from RetainingWallCalculatorTool.tsx on 2026-11-04. Edit here; RetainingWallCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type PresetId = "garden" | "seat" | "imperial" | "tall";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const FT_PER_M = 3.280839895;
export const CUFT_PER_M3 = 35.314666721;

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
  blockLen: string;
  blockH: string;
  buried: string;
  capLen: string;
  waste: string;
  trenchW: string;
  trenchD: string;
};

export const PRESETS: Preset[] = [
  { id: "garden", unit: "m", length: "6", height: "0.6", blockLen: "0.4", blockH: "0.2", buried: "1", capLen: "0.4", waste: "5", trenchW: "0.45", trenchD: "0.15" },
  { id: "seat", unit: "m", length: "4", height: "0.4", blockLen: "0.4", blockH: "0.2", buried: "1", capLen: "0.4", waste: "5", trenchW: "0.4", trenchD: "0.1" },
  { id: "imperial", unit: "ft", length: "20", height: "2", blockLen: "1", blockH: "0.333", buried: "1", capLen: "1", waste: "5", trenchW: "1.25", trenchD: "0.5" },
  { id: "tall", unit: "m", length: "8", height: "1", blockLen: "0.5", blockH: "0.2", buried: "1", capLen: "0.5", waste: "8", trenchW: "0.6", trenchD: "0.2" },
];
