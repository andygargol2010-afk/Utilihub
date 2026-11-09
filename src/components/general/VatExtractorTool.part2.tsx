// Part 2 of 3 — split from VatExtractorTool.tsx on 2026-11-04. Edit here; VatExtractorTool.tsx re-exports.
import { type Locale } from "./VatExtractorTool.part1";

export type Mode = "extract" | "add";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

export const PRESETS = [
  { rate: "21", es: "21% general (AR/ES)", en: "21% standard (AR/ES)" },
  { rate: "10.5", es: "10,5% reducido (AR)", en: "10.5% reduced (AR)" },
  { rate: "19", es: "19% (CL/CO)", en: "19% (CL/CO)" },
  { rate: "16", es: "16% (MX)", en: "16% (MX)" },
  { rate: "10", es: "10% reducido", en: "10% reduced" },
];

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
