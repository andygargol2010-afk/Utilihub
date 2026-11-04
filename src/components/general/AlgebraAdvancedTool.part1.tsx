"use client";
// Part 1 of 3 — split from AlgebraAdvancedTool.tsx on 2026-11-04. Edit here; AlgebraAdvancedTool.tsx re-exports.

export type Locale = "en" | "es";

export function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

export function fmt(n: number, d = 6) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(d).replace(/\.?0+$/, "");
}

export type Card = { label: string; value: string; hint?: string };

export type FieldSpec = { key: string; en: string; es: string; ph: string };

export const FIELDS: Record<string, FieldSpec[]> = {
  "formula-cuadratica": [
    { key: "a", en: "a (x² coeff)", es: "a (coef. x²)", ph: "e.g. 1" },
    { key: "b", en: "b (x coeff)", es: "b (coef. x)", ph: "e.g. -5" },
    { key: "c", en: "c (constant)", es: "c (constante)", ph: "e.g. 6" },
  ],
  discriminante: [
    { key: "a", en: "a", es: "a", ph: "e.g. 1" },
    { key: "b", en: "b", es: "b", ph: "e.g. -5" },
    { key: "c", en: "c", es: "c", ph: "e.g. 6" },
  ],
  "completar-cuadrado": [
    { key: "a", en: "a", es: "a", ph: "e.g. 1" },
    { key: "b", en: "b", es: "b", ph: "e.g. -6" },
    { key: "c", en: "c", es: "c", ph: "e.g. 5" },
  ],
  "sistema-ecuaciones-2x2": [
    { key: "a1", en: "a₁", es: "a₁", ph: "e.g. 2" },
    { key: "b1", en: "b₁", es: "b₁", ph: "e.g. 1" },
    { key: "c1", en: "c₁", es: "c₁", ph: "e.g. 5" },
    { key: "a2", en: "a₂", es: "a₂", ph: "e.g. 1" },
    { key: "b2", en: "b₂", es: "b₂", ph: "e.g. -1" },
    { key: "c2", en: "c₂", es: "c₂", ph: "e.g. 1" },
  ],
  "foil-binomios": [
    { key: "a", en: "a in (ax+b)", es: "a en (ax+b)", ph: "e.g. 1" },
    { key: "b", en: "b in (ax+b)", es: "b en (ax+b)", ph: "e.g. 2" },
    { key: "c", en: "c in (cx+d)", es: "c en (cx+d)", ph: "e.g. 3" },
    { key: "d", en: "d in (cx+d)", es: "d en (cx+d)", ph: "e.g. 4" },
  ],
  "factorizar-trinomio": [
    { key: "b", en: "b in x² + bx + c", es: "b en x² + bx + c", ph: "e.g. 5" },
    { key: "c", en: "c in x² + bx + c", es: "c en x² + bx + c", ph: "e.g. 6" },
  ],
  "pendiente-dos-puntos": [
    { key: "x1", en: "x₁", es: "x₁", ph: "e.g. 1" },
    { key: "y1", en: "y₁", es: "y₁", ph: "e.g. 2" },
    { key: "x2", en: "x₂", es: "x₂", ph: "e.g. 4" },
    { key: "y2", en: "y₂", es: "y₂", ph: "e.g. 8" },
  ],
};

export function polyTerm(coef: number, body: string, first: boolean): string {
  if (Math.abs(coef) < 1e-12) return first ? "0" : "";
  const sign = coef < 0 ? " − " : first ? "" : " + ";
  const abs = Math.abs(coef);
  const num = abs === 1 && body ? "" : fmt(abs);
  return `${sign}${num}${body}`;
}
