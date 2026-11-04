// Part 2 of 3 — split from SheetCalculatorTool.tsx on 2026-11-04. Edit here; SheetCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 2) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Unit = "m" | "ft";
export type Shape = "rect" | "area";
export type Material = "plywood" | "osb" | "mdf";

export type Preset = {
  id: string;
  unit: Unit;
  shape: Shape;
  length: string;
  width: string;
  area: string;
  openings: string;
  sheetL: string;
  sheetW: string;
  thickness: string;
  material: Material;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "subfloor", unit: "ft", shape: "rect", length: "12", width: "10", area: "120", openings: "0", sheetL: "8", sheetW: "4", thickness: "0.75", material: "osb", waste: "10" },
  { id: "sheathing", unit: "ft", shape: "rect", length: "24", width: "8", area: "192", openings: "28", sheetL: "8", sheetW: "4", thickness: "0.4375", material: "osb", waste: "12" },
  { id: "cabinet", unit: "m", shape: "area", length: "2.4", width: "1.2", area: "6.5", openings: "0", sheetL: "2.44", sheetW: "1.22", thickness: "18", material: "mdf", waste: "15" },
  { id: "metric", unit: "m", shape: "rect", length: "5", width: "3.2", area: "16", openings: "1.8", sheetL: "2.5", sheetW: "1.25", thickness: "18", material: "plywood", waste: "10" },
];

export const DENSITY: Record<Material, number> = { plywood: 550, osb: 650, mdf: 750 };
