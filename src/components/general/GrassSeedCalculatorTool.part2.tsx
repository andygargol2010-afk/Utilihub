// Part 2 of 3 — split from GrassSeedCalculatorTool.tsx on 2026-11-04. Edit here; GrassSeedCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Shape = "rect" | "area";
export type Job = "new" | "overseed" | "patch";
export type Species = "fescue" | "rye" | "bluegrass" | "bermuda" | "custom";
export type PresetId = "metric" | "overseed" | "patch" | "bluegrass";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

/** Planning rates in pounds per 1,000 sq ft for a new lawn. */
export const NEW_LB_PER_1000: Record<Exclude<Species, "custom">, number> = {
  fescue: 8,
  rye: 6,
  bluegrass: 3,
  bermuda: 1.5,
};

export const JOB_FACTOR: Record<Job, number> = {
  new: 1,
  overseed: 0.5,
  patch: 1.25,
};

export const LB_PER_1000_TO_G_PER_M2 = 4.8824276;
export const SQFT_PER_M2 = 10.7639104;
export const LB_PER_KG = 2.2046226218;

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
  length: string;
  width: string;
  area: string;
  hardscape: string;
  job: Job;
  species: Species;
  customRate: string;
  bag: string;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "metric", unit: "m", length: "10", width: "6", area: "60", hardscape: "0", job: "new", species: "fescue", customRate: "8", bag: "1", waste: "10" },
  { id: "overseed", unit: "ft", length: "80", width: "50", area: "4000", hardscape: "200", job: "overseed", species: "fescue", customRate: "8", bag: "10", waste: "10" },
  { id: "patch", unit: "m", length: "3", width: "2", area: "6", hardscape: "0", job: "patch", species: "bermuda", customRate: "1.5", bag: "1", waste: "15" },
  { id: "bluegrass", unit: "ft", length: "50", width: "40", area: "2000", hardscape: "0", job: "new", species: "bluegrass", customRate: "3", bag: "5", waste: "10" },
];
