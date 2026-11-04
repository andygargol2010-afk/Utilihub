"use client";
// Part 2 of 3 — split from ExpLogSuiteTool.tsx on 2026-11-04. Edit here; ExpLogSuiteTool.tsx re-exports.

export function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

export function fmt(n: number, d = 10) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-15) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e12) return String(n);
  if (Math.abs(n) >= 1e12 || (Math.abs(n) > 0 && Math.abs(n) < 1e-6)) return n.toExponential(6);
  return n.toPrecision(d).replace(/\.?0+$/, "");
}

export type Card = { label: string; value: string };
