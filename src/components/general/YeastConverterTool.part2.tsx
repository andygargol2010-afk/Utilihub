// Part 2 of 3 — split from YeastConverterTool.tsx on 2026-11-04. Edit here; YeastConverterTool.tsx re-exports.
import { type Locale } from "./YeastConverterTool.part1";

export type YeastKind = "instant" | "active" | "fresh" | "osmo";
export type Unit = "g" | "tsp" | "packet";
export type PresetId = "packet" | "tsp" | "cube25" | "cube42" | "active10";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

/** Weight relative to 1 g instant. Active dry is 25% more; fresh is triple. */
export const FACTOR: Record<YeastKind, number> = {
  instant: 1,
  active: 1.25,
  fresh: 3,
  osmo: 1,
};

export const GRAMS_PER_TSP: Partial<Record<YeastKind, number>> = {
  instant: 3.1,
  active: 2.8,
  osmo: 3.1,
};

export const PACKET_G = 7;
export const KINDS: YeastKind[] = ["instant", "active", "fresh", "osmo"];

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatAmount(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: value >= 100 ? 0 : 1,
    minimumFractionDigits: 0,
  }).format(value);
}
