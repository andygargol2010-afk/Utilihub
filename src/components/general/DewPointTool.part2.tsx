// Part 2 of 3 — split from DewPointTool.tsx on 2026-11-04. Edit here; DewPointTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Scale = "c" | "f";

export type Preset = { id: string; scale: Scale; temp: string; humidity: string };

export const PRESETS: Preset[] = [
  { id: "room", scale: "c", temp: "22", humidity: "45" },
  { id: "humid", scale: "c", temp: "30", humidity: "70" },
  { id: "night", scale: "c", temp: "5", humidity: "90" },
  { id: "desert", scale: "c", temp: "35", humidity: "15" },
];

/** August–Roche–Magnus (Alduchov & Eskridge): a = 17.625, b = 243.04 °C. */
export function dewPointC(tempC: number, rh: number) {
  const a = 17.625;
  const b = 243.04;
  const gamma = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  return (b * gamma) / (a - gamma);
}
