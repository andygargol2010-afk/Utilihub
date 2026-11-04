// Part 2 of 3 — split from BmiCalculatorTool.tsx on 2026-11-04. Edit here; BmiCalculatorTool.tsx re-exports.
import { type Locale } from "./BmiCalculatorTool.part1";

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export type CategoryKey = "underweight" | "normal" | "overweight" | "obese";

export function getBmiCategory(bmi: number): CategoryKey {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export const CATEGORY_LABEL: Record<Locale, Record<CategoryKey, string>> = {
  en: {
    underweight: "Underweight",
    normal: "Normal weight",
    overweight: "Overweight",
    obese: "Obesity",
  },
  es: {
    underweight: "Bajo peso",
    normal: "Peso normal",
    overweight: "Sobrepeso",
    obese: "Obesidad",
  },
};

export const WHO_ROWS: { key: CategoryKey; range: string; rangeEs: string }[] = [
  { key: "underweight", range: "< 18.5", rangeEs: "< 18,5" },
  { key: "normal", range: "18.5 – 24.9", rangeEs: "18,5 – 24,9" },
  { key: "overweight", range: "25 – 29.9", rangeEs: "25 – 29,9" },
  { key: "obese", range: "≥ 30", rangeEs: "≥ 30" },
];
