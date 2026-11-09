// Part 2 of 3 — split from PaintCalculatorTool.tsx on 2026-11-04. Edit here; PaintCalculatorTool.tsx re-exports.

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
  id: string;
  length: string;
  height: string;
  openings: string;
  coats: string;
  coverage: string;
  waste: string;
  can: string;
};

export const PRESETS: Preset[] = [
  { id: "latex", length: "12", height: "2.5", openings: "2.4", coats: "2", coverage: "10", waste: "10", can: "4" },
  { id: "ceiling", length: "4.5", height: "3.2", openings: "0", coats: "2", coverage: "8", waste: "10", can: "4" },
  { id: "primer", length: "12", height: "2.5", openings: "2.4", coats: "1", coverage: "12", waste: "8", can: "4" },
  { id: "exterior", length: "18", height: "2.8", openings: "3.5", coats: "2", coverage: "6", waste: "15", can: "10" },
];
