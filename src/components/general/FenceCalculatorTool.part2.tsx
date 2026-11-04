// Part 2 of 3 — split from FenceCalculatorTool.tsx on 2026-11-04. Edit here; FenceCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value);
}

export type Mode = "picket" | "panel";

export type Preset = {
  id: string;
  length: string;
  spacing: string;
  gates: string;
  gateWidth: string;
  mode: Mode;
  board: string;
  gap: string;
  panel: string;
  rails: string;
  waste: string;
  bags: string;
};

export const PRESETS: Preset[] = [
  { id: "privacy", length: "12", spacing: "1.8", gates: "1", gateWidth: "1", mode: "picket", board: "140", gap: "0", panel: "1.8", rails: "3", waste: "10", bags: "1" },
  { id: "gapped", length: "15", spacing: "2.4", gates: "1", gateWidth: "0.9", mode: "picket", board: "90", gap: "15", panel: "1.8", rails: "2", waste: "8", bags: "1" },
  { id: "panel", length: "18", spacing: "1.8", gates: "1", gateWidth: "1", mode: "panel", board: "140", gap: "0", panel: "1.8", rails: "0", waste: "5", bags: "2" },
];
