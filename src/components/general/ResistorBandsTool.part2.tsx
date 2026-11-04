// Part 2 of 3 — split from ResistorBandsTool.tsx on 2026-11-04. Edit here; ResistorBandsTool.tsx re-exports.
import { DIGIT_COLORS, MULTIPLIER_COLORS, TCR_COLORS, TOLERANCE_COLORS, type BandColor } from "@/lib/general/resistor-bands";

export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const ROLE_COLORS: Record<"digit" | "multiplier" | "tolerance" | "tcr", BandColor[]> = {
  digit: DIGIT_COLORS,
  multiplier: MULTIPLIER_COLORS,
  tolerance: TOLERANCE_COLORS,
  tcr: TCR_COLORS,
};
