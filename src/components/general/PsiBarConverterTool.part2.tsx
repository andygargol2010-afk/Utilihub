// Part 2 of 3 — split from PsiBarConverterTool.tsx on 2026-11-04. Edit here; PsiBarConverterTool.tsx re-exports.

export type Unit = "psi" | "bar";

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export const PSI_TO_BAR = 0.0689476;
export const BAR_TO_PSI = 14.5038;
