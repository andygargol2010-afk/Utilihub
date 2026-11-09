// Part 2 of 3 — split from RainwaterCalculatorTool.tsx on 2026-11-04. Edit here; RainwaterCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
export const GAL_PER_L = 0.264172052;

export function parseNum(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(value);
}

export type Preset = {
  id: string;
  area: string;
  storm: string;
  annual: string;
  coeff: string;
  flush: string;
  barrel: string;
  daily: string;
};

export const PRESETS: Preset[] = [
  { id: "shed", area: "18", storm: "20", annual: "800", coeff: "0.90", flush: "0", barrel: "200", daily: "20" },
  { id: "house", area: "90", storm: "25", annual: "650", coeff: "0.80", flush: "20", barrel: "200", daily: "40" },
  { id: "tile", area: "120", storm: "15", annual: "900", coeff: "0.75", flush: "15", barrel: "300", daily: "50" },
  { id: "tank", area: "45", storm: "30", annual: "500", coeff: "0.85", flush: "10", barrel: "1000", daily: "30" },
];
