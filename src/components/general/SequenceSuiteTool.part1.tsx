"use client";
// Part 1 of 3 — split from SequenceSuiteTool.tsx on 2026-11-04. Edit here; SequenceSuiteTool.tsx re-exports.

export type Locale = "en" | "es";

export function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

export function fmt(n: number, d = 10) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  if (Math.abs(n) >= 1e15 || (Math.abs(n) > 0 && Math.abs(n) < 1e-6)) return n.toExponential(6);
  return n.toPrecision(d).replace(/\.?0+$/, "");
}

export type Card = { label: string; value: string; hint?: string };

export function fibExact(n: number): { fn: number; sum: number; approx: boolean } {
  if (n === 0) return { fn: 0, sum: 0, approx: false };
  if (n === 1) return { fn: 1, sum: 1, approx: false };
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  let s0 = 0;
  let s1 = 1;
  for (let i = 2; i <= n + 2; i++) {
    const c = s0 + s1;
    s0 = s1;
    s1 = c;
  }
  return { fn: b, sum: s1 - 1, approx: n > 70 };
}
