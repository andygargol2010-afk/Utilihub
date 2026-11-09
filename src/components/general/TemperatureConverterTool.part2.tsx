// Part 2 of 3 — split from TemperatureConverterTool.tsx on 2026-11-04. Edit here; TemperatureConverterTool.tsx re-exports.

export type Unit = "C" | "F" | "K";

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function toCelsius(value: number, from: Unit): number {
  if (from === "C") return value;
  if (from === "F") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

export function fromCelsius(celsius: number, to: Unit): number {
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export function round(n: number) {
  return Math.round(n * 100) / 100;
}
