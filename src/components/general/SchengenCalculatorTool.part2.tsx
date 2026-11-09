// Part 2 of 3 — split from SchengenCalculatorTool.tsx on 2026-11-04. Edit here; SchengenCalculatorTool.tsx re-exports.
import { newStayId, type SchengenStay } from "@/lib/general/schengen";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function stay(entry: string, exit: string): SchengenStay {
  return { id: newStayId(), entry, exit };
}
