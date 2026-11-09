// Part 2 of 3 — split from PoolCalculatorTool.tsx on 2026-11-04. Edit here; PoolCalculatorTool.tsx re-exports.
import { type Locale } from "./PoolCalculatorTool.part1";

export type Shape = "rect" | "round" | "oval";
export type Unit = "m" | "ft";
export type Chlorine = "liquid125" | "liquid6" | "cal65" | "tri90";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

export const FT = 0.3048;
export const LITER_PER_M3 = 1000;
export const US_GAL_PER_L = 1 / 3.785411784;
export const UK_GAL_PER_L = 1 / 4.54609;

/** Ounces of product to raise 10,000 US gallons by 1 ppm FC. Industry rule of thumb. */
export const DOSE_PER_10K_PPM: Record<Chlorine, { oz: number; liquid: boolean }> = {
  liquid125: { oz: 10.7, liquid: true },
  liquid6: { oz: 22.4, liquid: true },
  cal65: { oz: 2, liquid: false },
  tri90: { oz: 1.5, liquid: false },
};

export function parseNum(value: string) {
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

export function fmt(n: number, locale: Locale, digits = 1) {
  return n.toLocaleString(locale === "es" ? "es-AR" : "en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}
