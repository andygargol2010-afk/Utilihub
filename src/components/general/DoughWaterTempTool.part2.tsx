// Part 2 of 3 — split from DoughWaterTempTool.tsx on 2026-11-04. Edit here; DoughWaterTempTool.tsx re-exports.
import { type Locale } from "./DoughWaterTempTool.part1";

export type Unit = "C" | "F";
export type PresetId = "hand" | "stand" | "spiral" | "us78";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function toF(c: number) {
  return (c * 9) / 5 + 32;
}

export function toC(f: number) {
  return ((f - 32) * 5) / 9;
}

export function formatTemp(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}
