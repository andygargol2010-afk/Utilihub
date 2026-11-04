// Part 2 of 3 — split from BakersPercentageTool.tsx on 2026-11-04. Edit here; BakersPercentageTool.tsx re-exports.
import { type Locale } from "./BakersPercentageTool.part1";

export type Mode = "flour" | "dough";
export type YeastKind = "instant" | "fresh";
export type PresetId = "sandwich" | "baguette" | "pizza" | "ciabatta" | "focaccia" | "sourdough";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export type Preset = {
  id: PresetId;
  hydration: string;
  salt: string;
  yeast: string;
  fat: string;
  extras: string;
  starter: string;
  starterHydration: string;
};

export const PRESETS: Preset[] = [
  { id: "sandwich", hydration: "62", salt: "1.8", yeast: "1", fat: "4", extras: "0", starter: "0", starterHydration: "100" },
  { id: "baguette", hydration: "68", salt: "2", yeast: "0.8", fat: "0", extras: "0", starter: "0", starterHydration: "100" },
  { id: "pizza", hydration: "65", salt: "2.8", yeast: "0.2", fat: "0", extras: "0", starter: "0", starterHydration: "100" },
  { id: "ciabatta", hydration: "80", salt: "2", yeast: "0.6", fat: "0", extras: "0", starter: "0", starterHydration: "100" },
  { id: "focaccia", hydration: "78", salt: "2.2", yeast: "0.8", fat: "6", extras: "0", starter: "0", starterHydration: "100" },
  { id: "sourdough", hydration: "75", salt: "2", yeast: "0", fat: "0", extras: "0", starter: "20", starterHydration: "100" },
];

export function parseNum(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function formatGrams(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}
