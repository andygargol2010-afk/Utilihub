// Part 2 of 3 — split from OvertimePayTool.tsx on 2026-11-04. Edit here; OvertimePayTool.tsx re-exports.
import { type Locale } from "./OvertimePayTool.part1";

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
