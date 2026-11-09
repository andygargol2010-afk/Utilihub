// Part 2 of 3 — split from ShoeSizeTool.tsx on 2026-11-04. Edit here; ShoeSizeTool.tsx re-exports.
import { type ShoeSystem } from "@/lib/general/shoe-size";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const SYSTEMS: ShoeSystem[] = ["eu", "uk", "usM", "usW", "cm"];

export function systemLabel(system: ShoeSystem, es: boolean) {
  if (system === "eu") return "EU";
  if (system === "uk") return "UK";
  if (system === "usM") return es ? "US hombre" : "US men";
  if (system === "usW") return es ? "US mujer" : "US women";
  return es ? "cm (largo del pie)" : "cm (foot length)";
}
