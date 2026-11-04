// Part 2 of 3 — split from FlooringCalculatorTool.tsx on 2026-11-04. Edit here; FlooringCalculatorTool.tsx re-exports.

export type LayoutId = "straight" | "wide" | "vinyl" | "herringbone";

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
  id: LayoutId;
  lengthMm: string;
  widthMm: string;
  packM2: string;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "straight", lengthMm: "1380", widthMm: "193", packM2: "2.22", waste: "8" },
  { id: "wide", lengthMm: "1524", widthMm: "228", packM2: "2.16", waste: "8" },
  { id: "vinyl", lengthMm: "1220", widthMm: "180", packM2: "2.2", waste: "8" },
  { id: "herringbone", lengthMm: "600", widthMm: "100", packM2: "1.44", waste: "15" },
];
