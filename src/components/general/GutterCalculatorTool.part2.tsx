// Part 2 of 3 — split from GutterCalculatorTool.tsx on 2026-11-04. Edit here; GutterCalculatorTool.tsx re-exports.

export type Unit = "m" | "ft";
export type Layout = "closed" | "two" | "one" | "custom";
export type PresetId = "metric" | "us" | "front" | "rain";

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
  section: string;
  hanger: string;
  downspout: string;
  waste: string;
};

export const PRESETS: Preset[] = [
  { id: "metric", unit: "m", layout: "closed", length: "10", width: "8", section: "3", hanger: "0.6", downspout: "10", waste: "8" },
  { id: "us", unit: "ft", layout: "closed", length: "40", width: "30", section: "10", hanger: "2", downspout: "30", waste: "8" },
  { id: "front", unit: "m", layout: "two", length: "12", width: "8", section: "3", hanger: "0.6", downspout: "10", waste: "10" },
  { id: "rain", unit: "ft", layout: "closed", length: "40", width: "30", section: "10", hanger: "1.5", downspout: "20", waste: "10" },
];
