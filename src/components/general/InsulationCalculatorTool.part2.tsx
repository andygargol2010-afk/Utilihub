// Part 2 of 3 — split from InsulationCalculatorTool.tsx on 2026-11-04. Edit here; InsulationCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Layout = "walls" | "attic" | "area";
export type PresetId = "r13" | "attic" | "panel" | "roll";

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
  width: string;
  walls: string;
  openings: string;
  pieceW: string;
  pieceL: string;
  perPack: string;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "r13", unit: "ft", layout: "walls", length: "40", width: "8", walls: "4", openings: "48", pieceW: "1.25", pieceL: "7.75", perPack: "10", waste: "10" },
  { id: "attic", unit: "ft", layout: "attic", length: "40", width: "30", walls: "1", openings: "0", pieceW: "1.25", pieceL: "32", perPack: "1", waste: "10" },
  { id: "panel", unit: "m", layout: "walls", length: "4", width: "2.4", walls: "4", openings: "4", pieceW: "0.6", pieceL: "1.2", perPack: "8", waste: "10" },
  { id: "roll", unit: "m", layout: "attic", length: "8", width: "6", walls: "1", openings: "0", pieceW: "0.6", pieceL: "10", perPack: "1", waste: "8" },
];
