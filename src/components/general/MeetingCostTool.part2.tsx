// Part 2 of 3 — split from MeetingCostTool.tsx on 2026-11-04. Edit here; MeetingCostTool.tsx re-exports.
import { type Locale } from "./MeetingCostTool.part1";

export type Cadence = "once" | "weekly" | "biweekly" | "monthly";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

export function parseNum(value: string) {
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

export function money(amount: number, currency: string, locale: Locale) {
  const formatted = amount.toLocaleString(locale === "es" ? "es-AR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${formatted}` : formatted;
}

export const PRESETS = [
  { id: "standup", minutes: 15, en: "Standup 15 min", es: "Daily 15 min" },
  { id: "sync", minutes: 30, en: "Sync 30 min", es: "Sync 30 min" },
  { id: "planning", minutes: 60, en: "Planning 1 h", es: "Planning 1 h" },
  { id: "workshop", minutes: 120, en: "Workshop 2 h", es: "Taller 2 h" },
] as const;
