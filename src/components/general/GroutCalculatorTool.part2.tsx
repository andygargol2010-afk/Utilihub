// Part 2 of 3 — split from GroutCalculatorTool.tsx on 2026-11-04. Edit here; GroutCalculatorTool.tsx re-exports.

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
export type Grout = "sanded" | "unsanded" | "epoxy";

export type Preset = {
  id: string;
  unit: Unit;
  mode: Mode;
  area: string;
  length: string;
  width: string;
  tileL: string;
  tileW: string;
  joint: string;
  depth: string;
  grout: Grout;
  bag: string;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "floor", unit: "m", mode: "rect", area: "12", length: "4", width: "3", tileL: "600", tileW: "600", joint: "2", depth: "10", grout: "sanded", bag: "5", waste: "10" },
  { id: "subway", unit: "m", mode: "area", area: "4", length: "2", width: "2", tileL: "75", tileW: "150", joint: "3", depth: "8", grout: "unsanded", bag: "2.5", waste: "10" },
  { id: "mosaic", unit: "m", mode: "area", area: "1.5", length: "1.5", width: "1", tileL: "25", tileW: "25", joint: "2", depth: "4", grout: "unsanded", bag: "1", waste: "15" },
  { id: "inch", unit: "ft", mode: "rect", area: "100", length: "10", width: "8", tileL: "12", tileW: "12", joint: "0.125", depth: "0.375", grout: "sanded", bag: "10", waste: "10" },
];

export const DENSITY: Record<Grout, number> = { sanded: 1.6, unsanded: 1.5, epoxy: 1.55 };
