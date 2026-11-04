// Part 2 of 3 — split from HeatIndexTool.tsx on 2026-11-04. Edit here; HeatIndexTool.tsx re-exports.

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  if (!value.trim()) return null;
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, digits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

export type Scale = "c" | "f";
export type Mode = "heat" | "wind";
export type Speed = "kmh" | "mph";

export type Preset = {
  id: string;
  mode: Mode;
  scale: Scale;
  temp: string;
  humidity: string;
  wind: string;
  speed: Speed;
};

export const PRESETS: Preset[] = [
  { id: "humid", mode: "heat", scale: "c", temp: "32", humidity: "70", wind: "15", speed: "kmh" },
  { id: "extreme", mode: "heat", scale: "c", temp: "40", humidity: "40", wind: "10", speed: "kmh" },
  { id: "breeze", mode: "wind", scale: "c", temp: "0", humidity: "50", wind: "20", speed: "kmh" },
  { id: "cold", mode: "wind", scale: "c", temp: "-15", humidity: "50", wind: "40", speed: "kmh" },
];

export function toF(temp: number, scale: Scale) {
  return scale === "f" ? temp : temp * 1.8 + 32;
}

export function fromF(tempF: number, scale: Scale) {
  return scale === "f" ? tempF : (tempF - 32) / 1.8;
}

export function heatIndexF(tempF: number, rh: number) {
  const simple = 0.5 * (tempF + 61 + (tempF - 68) * 1.2 + rh * 0.094);
  if (simple < 80) return { hi: simple, method: "simple" as const };
  let hi =
    -42.379 +
    2.04901523 * tempF +
    10.14333127 * rh -
    0.22475541 * tempF * rh -
    0.00683783 * tempF * tempF -
    0.05481717 * rh * rh +
    0.00122874 * tempF * tempF * rh +
    0.00085282 * tempF * rh * rh -
    0.00000199 * tempF * tempF * rh * rh;
  if (rh < 13 && tempF >= 80 && tempF <= 112) {
    hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
  } else if (rh > 85 && tempF >= 80 && tempF <= 87) {
    hi += ((rh - 85) / 10) * ((87 - tempF) / 5);
  }
  return { hi, method: "rothfusz" as const };
}

export function windChillF(tempF: number, mph: number) {
  const v = Math.pow(mph, 0.16);
  return 35.74 + 0.6215 * tempF - 35.75 * v + 0.4275 * tempF * v;
}
