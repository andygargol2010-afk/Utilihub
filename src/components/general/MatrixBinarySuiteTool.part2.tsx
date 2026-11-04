"use client";
// Part 2 of 3 — split from MatrixBinarySuiteTool.tsx on 2026-11-04. Edit here; MatrixBinarySuiteTool.tsx re-exports.

export function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

export function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return String(n);
  return n.toPrecision(10).replace(/\.?0+$/, "");
}

export type Card = { label: string; value: string; hint?: string };
