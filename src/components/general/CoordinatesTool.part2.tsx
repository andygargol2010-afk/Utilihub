// Part 2 of 3 — split from CoordinatesTool.tsx on 2026-11-04. Edit here; CoordinatesTool.tsx re-exports.

export type Mode = "decimal" | "dms";

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const MADRID = { lat: "40.4168", lon: "-3.7038" };
export const BARCELONA = {
  latDeg: "41",
  latMin: "24",
  latSec: "12.20",
  latH: "N" as const,
  lonDeg: "2",
  lonMin: "10",
  lonSec: "26.50",
  lonH: "E" as const,
};
