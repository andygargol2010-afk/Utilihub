// Part 2 of 3 — split from RecipeScalerCalculatorTool.tsx on 2026-11-04. Edit here; RecipeScalerCalculatorTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function scale(original: number, factor: number): number | { error: string } {
  if (!Number.isFinite(original) || original <= 0) return { error: "original" };
  if (!Number.isFinite(factor) || factor <= 0) return { error: "factor" };
  return original * factor;
}
