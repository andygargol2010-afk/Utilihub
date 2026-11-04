// Part 2 of 3 — split from ThinsetCalculatorTool.tsx on 2026-11-04. Edit here; ThinsetCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Unit = "m" | "ft";
export type Mode = "area" | "rect";
export type Notch = "3" | "6" | "8" | "10" | "12" | "15";

export type Preset = {
  id: string;
  unit: Unit;
  mode: Mode;
  area: string;
  length: string;
  width: string;
  notch: Notch;
  bag: string;
  waste: string;
  butter: boolean;
};

export const PRESETS: Preset[] = [
  { id: "wall", unit: "m", mode: "rect", area: "8", length: "4", width: "2", notch: "6", bag: "25", waste: "10", butter: false },
  { id: "floor", unit: "m", mode: "rect", area: "12", length: "4", width: "3", notch: "10", bag: "25", waste: "10", butter: false },
  { id: "large", unit: "m", mode: "area", area: "18", length: "6", width: "3", notch: "12", bag: "25", waste: "10", butter: true },
  { id: "mosaic", unit: "m", mode: "area", area: "4", length: "2", width: "2", notch: "3", bag: "5", waste: "15", butter: false },
];

export const RATE: Record<Notch, number> = { "3": 1.5, "6": 3, "8": 4, "10": 5, "12": 6.5, "15": 8 };
export const BUTTER_KG = 1;
