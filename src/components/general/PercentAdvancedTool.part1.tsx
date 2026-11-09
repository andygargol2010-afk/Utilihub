"use client";
// Part 1 of 3 — split from PercentAdvancedTool.tsx on 2026-11-04. Edit here; PercentAdvancedTool.tsx re-exports.

export type Locale = "en" | "es";

export function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

export function fmt(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return String(n);
  const t = n.toFixed(digits).replace(/\.?0+$/, "");
  return t;
}
