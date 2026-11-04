// Part 2 of 3 — split from CaulkCalculatorTool.tsx on 2026-11-04. Edit here; CaulkCalculatorTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Unit = "m" | "ft";
export type Mode = "length" | "openings";
export type Profile = "fillet" | "butt";
export type Tube = "300" | "310" | "299" | "600";

export type Preset = {
  id: string;
  unit: Unit;
  mode: Mode;
  length: string;
  count: string;
  openingW: string;
  openingH: string;
  beadW: string;
  beadD: string;
  profile: Profile;
  tube: Tube;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "bath", unit: "m", mode: "length", length: "8", count: "1", openingW: "0.8", openingH: "1.2", beadW: "5", beadD: "5", profile: "fillet", tube: "300", waste: "10" },
  { id: "windows", unit: "m", mode: "openings", length: "12", count: "4", openingW: "1.2", openingH: "1.4", beadW: "6", beadD: "6", profile: "fillet", tube: "310", waste: "15" },
  { id: "counter", unit: "ft", mode: "length", length: "20", count: "1", openingW: "3", openingH: "4", beadW: "0.25", beadD: "0.25", profile: "fillet", tube: "299", waste: "10" },
  { id: "exterior", unit: "m", mode: "length", length: "15", count: "2", openingW: "0.9", openingH: "2.1", beadW: "10", beadD: "8", profile: "butt", tube: "600", waste: "15" },
];

export const TUBE_ML: Record<Tube, number> = { "300": 300, "310": 310, "299": 299, "600": 600 };
