"use client";
// Part 1 of 3 — split from GeometrySuiteTool.tsx on 2026-11-04. Edit here; GeometrySuiteTool.tsx re-exports.

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

export const DEG = Math.PI / 180;

export const FIELDS: Record<string, FieldSpec[]> = {
  "formula-heron": [
    { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 3" },
    { key: "b", en: "Side b", es: "Lado b", ph: "e.g. 4" },
    { key: "c", en: "Side c", es: "Lado c", ph: "e.g. 5" },
  ],
  "triangulo-rectangulo": [
    { key: "a", en: "Leg a", es: "Cateto a", ph: "e.g. 3" },
    { key: "b", en: "Leg b", es: "Cateto b", ph: "e.g. 4" },
  ],
  "ley-de-senos": [
    { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 7" },
    { key: "A", en: "Angle A (°)", es: "Ángulo A (°)", ph: "e.g. 40" },
    { key: "b", en: "Side b (optional if B given)", es: "Lado b (opcional si das B)", ph: "e.g. 10" },
    { key: "B", en: "Angle B ° (optional if b given)", es: "Ángulo B ° (opcional si das b)", ph: "e.g. 60" },
  ],
  "ley-de-cosenos": [
    { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 5" },
    { key: "b", en: "Side b", es: "Lado b", ph: "e.g. 6" },
    { key: "cOrC", en: "Side c OR angle C (°)", es: "Lado c O ángulo C (°)", ph: "e.g. 7 or 60" },
  ],
  "distancia-dos-puntos": [
    { key: "x1", en: "x₁", es: "x₁", ph: "e.g. 0" },
    { key: "y1", en: "y₁", es: "y₁", ph: "e.g. 0" },
    { key: "x2", en: "x₂", es: "x₂", ph: "e.g. 3" },
    { key: "y2", en: "y₂", es: "y₂", ph: "e.g. 4" },
  ],
  "punto-medio": [
    { key: "x1", en: "x₁", es: "x₁", ph: "e.g. 0" },
    { key: "y1", en: "y₁", es: "y₁", ph: "e.g. 0" },
    { key: "x2", en: "x₂", es: "x₂", ph: "e.g. 4" },
    { key: "y2", en: "y₂", es: "y₂", ph: "e.g. 6" },
  ],
  "area-poligono-regular": [
    { key: "n", en: "Number of sides n", es: "Número de lados n", ph: "e.g. 6" },
    { key: "s", en: "Side length s", es: "Longitud del lado s", ph: "e.g. 4" },
  ],
  "area-elipse": [
    { key: "a", en: "Semi-axis a", es: "Semieje a", ph: "e.g. 5" },
    { key: "b", en: "Semi-axis b", es: "Semieje b", ph: "e.g. 3" },
  ],
};
