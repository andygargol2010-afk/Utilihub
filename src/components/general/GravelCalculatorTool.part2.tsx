// Part 2 of 3 — split from GravelCalculatorTool.tsx on 2026-11-04. Edit here; GravelCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Shape = "rect" | "circle" | "area";
export type BagUnit = "kg" | "L";

export type Preset = {
  id: string;
  shape: Shape;
  length: string;
  width: string;
  diameter: string;
  area: string;
  depth: string;
  density: string;
  waste: string;
  bag: string;
  bagUnit: BagUnit;
};

export const PRESETS: Preset[] = [
  { id: "path", shape: "rect", length: "8", width: "1.2", diameter: "3", area: "10", depth: "5", density: "1.5", waste: "10", bag: "20", bagUnit: "kg" },
  { id: "drive", shape: "rect", length: "6", width: "3", diameter: "4", area: "18", depth: "10", density: "1.6", waste: "8", bag: "25", bagUnit: "kg" },
  { id: "mulch", shape: "rect", length: "4", width: "1.5", diameter: "2.4", area: "6", depth: "7", density: "0.4", waste: "5", bag: "50", bagUnit: "L" },
  { id: "soil", shape: "area", length: "5", width: "2", diameter: "3", area: "12", depth: "10", density: "1.25", waste: "10", bag: "20", bagUnit: "kg" },
];

export const YD3_PER_M3 = 1.3079506193;
