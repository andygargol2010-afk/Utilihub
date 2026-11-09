"use client";
// Part 2 of 3 — split from SequenceSuiteTool.tsx on 2026-11-04. Edit here; SequenceSuiteTool.tsx re-exports.
import { type Card, fibExact, fmt } from "./SequenceSuiteTool.part1";

export function compute(slug: string, vals: Record<string, number>, es: boolean): Card[] {
  switch (slug) {
    case "fibonacci": {
      const n = vals.n;
      if (!Number.isInteger(n) || n < 0)
        throw new Error(es ? "n debe ser un entero ≥ 0." : "n must be an integer ≥ 0.");
      if (n > 1476) throw new Error(es ? "n demasiado grande (overflow)." : "n too large (overflow).");
      const { fn, sum, approx } = fibExact(n);
      return [
        { label: `F(${n})`, value: fmt(fn), hint: approx ? (es ? "Precisión flotante" : "Floating precision") : undefined },
        { label: es ? `Suma F(0)…F(${n})` : `Sum F(0)…F(${n})`, value: fmt(sum) },
        { label: es ? "Identidad" : "Identity", value: "Σ = F(n+2) − 1" },
      ];
    }
    case "sucesion-aritmetica": {
      const { a1, d, n } = vals;
      if (!Number.isInteger(n) || n < 1)
        throw new Error(es ? "n debe ser un entero ≥ 1." : "n must be an integer ≥ 1.");
      if (!Number.isFinite(a1) || !Number.isFinite(d))
        throw new Error(es ? "Completá a₁ y d." : "Fill a₁ and d.");
      const an = a1 + (n - 1) * d;
      const sn = (n / 2) * (2 * a1 + (n - 1) * d);
      return [
        { label: `aₙ (n=${n})`, value: fmt(an) },
        { label: `Sₙ`, value: fmt(sn) },
        { label: es ? "Fórmula aₙ" : "Formula aₙ", value: "a₁ + (n−1)d" },
      ];
    }
    case "sucesion-geometrica": {
      const { a1, r, n } = vals;
      if (!Number.isInteger(n) || n < 1)
        throw new Error(es ? "n debe ser un entero ≥ 1." : "n must be an integer ≥ 1.");
      if (!Number.isFinite(a1) || !Number.isFinite(r))
        throw new Error(es ? "Completá a₁ y r." : "Fill a₁ and r.");
      const an = a1 * Math.pow(r, n - 1);
      const sn = r === 1 ? n * a1 : (a1 * (1 - Math.pow(r, n))) / (1 - r);
      return [
        { label: `aₙ (n=${n})`, value: fmt(an) },
        { label: `Sₙ`, value: fmt(sn) },
        { label: es ? "Fórmula aₙ" : "Formula aₙ", value: "a₁ · rⁿ⁻¹" },
      ];
    }
    case "suma-naturales-cuadrados": {
      const n = vals.n;
      if (!Number.isInteger(n) || n < 0)
        throw new Error(es ? "n debe ser un entero ≥ 0." : "n must be an integer ≥ 0.");
      if (n > 1e8) throw new Error(es ? "n demasiado grande." : "n too large.");
      const sumN = (n * (n + 1)) / 2;
      const sumSq = (n * (n + 1) * (2 * n + 1)) / 6;
      return [
        { label: es ? "Suma 1…n" : "Sum 1…n", value: fmt(sumN), hint: "n(n+1)/2" },
        { label: es ? "Suma 1²…n²" : "Sum 1²…n²", value: fmt(sumSq), hint: "n(n+1)(2n+1)/6" },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}

export const FIELDS: Record<string, { key: string; en: string; es: string; ph: string }[]> = {
  fibonacci: [{ key: "n", en: "n (index ≥ 0)", es: "n (índice ≥ 0)", ph: "e.g. 10" }],
  "sucesion-aritmetica": [
    { key: "a1", en: "First term a₁", es: "Primer término a₁", ph: "e.g. 3" },
    { key: "d", en: "Common difference d", es: "Diferencia común d", ph: "e.g. 2" },
    { key: "n", en: "Term index n ≥ 1", es: "Índice n ≥ 1", ph: "e.g. 10" },
  ],
  "sucesion-geometrica": [
    { key: "a1", en: "First term a₁", es: "Primer término a₁", ph: "e.g. 2" },
    { key: "r", en: "Common ratio r", es: "Razón común r", ph: "e.g. 3" },
    { key: "n", en: "Term index n ≥ 1", es: "Índice n ≥ 1", ph: "e.g. 5" },
  ],
  "suma-naturales-cuadrados": [{ key: "n", en: "n ≥ 0", es: "n ≥ 0", ph: "e.g. 100" }],
};
