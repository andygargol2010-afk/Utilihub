// Part 2 of 3 — split from CagrCalculatorTool.tsx on 2026-11-04. Edit here; CagrCalculatorTool.tsx re-exports.

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function cagr(initial: number, final: number, years: number): number | { error: string } {
  if (!Number.isFinite(initial) || initial <= 0) return { error: "initial" };
  if (!Number.isFinite(final) || final <= 0) return { error: "final" };
  if (!Number.isFinite(years) || years <= 0) return { error: "years" };
  return Math.pow(final / initial, 1 / years) - 1;
}
