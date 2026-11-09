// Part 2 of 3 — split from PaverCalculatorTool.tsx on 2026-11-04. Edit here; PaverCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Shape = "rect" | "area";
export type Unit = "m" | "ft";
export type PaverUnit = "cm" | "in";

export type Preset = {
  id: string;
  shape: Shape;
  unit: Unit;
  length: string;
  width: string;
  area: string;
  perimeter: string;
  paverUnit: PaverUnit;
  paverL: string;
  paverW: string;
  gapMm: string;
  waste: string;
  border: boolean;
  baseCm: string;
  baseWaste: string;
};

export const PRESETS: Preset[] = [
  {
    id: "patio",
    shape: "rect",
    unit: "m",
    length: "4",
    width: "3",
    area: "12",
    perimeter: "14",
    paverUnit: "cm",
    paverL: "20",
    paverW: "10",
    gapMm: "3",
    waste: "10",
    border: true,
    baseCm: "10",
    baseWaste: "8",
  },
  {
    id: "walk",
    shape: "rect",
    unit: "m",
    length: "8",
    width: "1.2",
    area: "9.6",
    perimeter: "18.4",
    paverUnit: "cm",
    paverL: "20",
    paverW: "10",
    gapMm: "3",
    waste: "8",
    border: false,
    baseCm: "8",
    baseWaste: "5",
  },
  {
    id: "entry",
    shape: "rect",
    unit: "ft",
    length: "10",
    width: "6",
    area: "60",
    perimeter: "32",
    paverUnit: "in",
    paverL: "8",
    paverW: "4",
    gapMm: "4",
    waste: "12",
    border: true,
    baseCm: "10",
    baseWaste: "10",
  },
];

export const FT = 0.3048;
export const IN = 0.0254;
