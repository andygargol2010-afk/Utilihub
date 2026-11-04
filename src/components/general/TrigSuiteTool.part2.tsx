"use client";
// Part 2 of 3 — split from TrigSuiteTool.tsx on 2026-11-04. Edit here; TrigSuiteTool.tsx re-exports.

export const DEG = Math.PI / 180;

export function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}
export function fmt(n: number, d = 8) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e12) return String(n);
  return n.toFixed(d).replace(/\.?0+$/, "");
}
export type Card = { label: string; value: string };

export function normDeg(deg: number) {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}
