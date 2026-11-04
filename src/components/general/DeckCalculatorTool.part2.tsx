// Part 2 of 3 — split from DeckCalculatorTool.tsx on 2026-11-04. Edit here; DeckCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

export type Direction = "length" | "width";

export type Preset = {
  id: string;
  length: string;
  width: string;
  board: string;
  gap: string;
  stock: string;
  spacing: string;
  waste: string;
  direction: Direction;
};

export const PRESETS: Preset[] = [
  { id: "patio", length: "3.6", width: "2.4", board: "140", gap: "5", stock: "3.6", direction: "length", spacing: "400", waste: "10" },
  { id: "family", length: "4.8", width: "3.6", board: "140", gap: "5", stock: "4.8", direction: "length", spacing: "400", waste: "12" },
  { id: "wide", length: "6", width: "4", board: "90", gap: "5", stock: "3", direction: "width", spacing: "600", waste: "15" },
];
