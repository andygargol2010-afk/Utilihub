"use client";
// Part 2 of 3 — split from PercentAdvancedTool.tsx on 2026-11-04. Edit here; PercentAdvancedTool.tsx re-exports.
import { fmt } from "./PercentAdvancedTool.part1";

export type ResultCard = { label: string; value: string; hint?: string };

export function compute(slug: string, a: number, b: number, mode: string, es: boolean): ResultCard[] {
  switch (slug) {
    case "porcentaje-aumento": {
      if (a === 0) throw new Error(es ? "El valor inicial no puede ser 0." : "Initial value cannot be 0.");
      const pct = ((b - a) / a) * 100;
      const abs = b - a;
      return [
        { label: es ? "Aumento porcentual" : "Percentage increase", value: `${fmt(pct)} %` },
        { label: es ? "Diferencia absoluta" : "Absolute change", value: fmt(abs) },
        { label: es ? "Factor" : "Multiplier", value: fmt(b / a), hint: es ? "Nuevo ÷ inicial" : "New ÷ initial" },
      ];
    }
    case "porcentaje-disminucion": {
      if (a === 0) throw new Error(es ? "El valor inicial no puede ser 0." : "Initial value cannot be 0.");
      const pct = ((a - b) / a) * 100;
      return [
        { label: es ? "Disminución porcentual" : "Percentage decrease", value: `${fmt(pct)} %` },
        { label: es ? "Unidades menos" : "Units lost", value: fmt(a - b) },
        { label: es ? "Queda (ratio)" : "Remaining ratio", value: fmt(b / a) },
      ];
    }
    case "diferencia-porcentual": {
      const mid = (a + b) / 2;
      if (mid === 0) throw new Error(es ? "Ambos valores no pueden ser 0." : "Both values cannot be 0.");
      const pct = (Math.abs(a - b) / Math.abs(mid)) * 100;
      return [
        { label: es ? "Diferencia porcentual" : "Percentage difference", value: `${fmt(pct)} %` },
        { label: es ? "Diferencia absoluta" : "Absolute difference", value: fmt(Math.abs(a - b)) },
        { label: es ? "Promedio de A y B" : "Average of A and B", value: fmt(mid) },
      ];
    }
    case "porcentaje-de-porcentaje": {
      const combined = (a * b) / 100;
      return [
        { label: es ? "Porcentaje combinado" : "Combined percent of whole", value: `${fmt(combined)} %` },
        { label: es ? "Como decimal" : "As decimal", value: fmt(combined / 100) },
        {
          label: es ? "Ejemplo sobre 1000" : "Example on 1000",
          value: fmt((combined / 100) * 1000),
          hint: es ? `${fmt(a)}% de ${fmt(b)}% de 1000` : `${fmt(a)}% of ${fmt(b)}% of 1000`,
        },
      ];
    }
    case "porcentaje-hasta-meta": {
      if (b === 0) throw new Error(es ? "La meta debe ser distinta de 0." : "Goal must be non-zero.");
      const progress = (a / b) * 100;
      const remainingPct = Math.max(0, 100 - progress);
      const remainingUnits = Math.max(0, b - a);
      return [
        { label: es ? "Progreso" : "Progress", value: `${fmt(progress)} %` },
        { label: es ? "Restante" : "Remaining", value: `${fmt(remainingPct)} %` },
        { label: es ? "Unidades por alcanzar" : "Units to goal", value: fmt(remainingUnits) },
      ];
    }
    case "fraccion-a-porcentaje": {
      if (b === 0) throw new Error(es ? "El denominador no puede ser 0." : "Denominator cannot be 0.");
      const pct = (a / b) * 100;
      return [
        { label: es ? "Porcentaje" : "Percentage", value: `${fmt(pct)} %` },
        { label: es ? "Decimal" : "Decimal", value: fmt(a / b) },
        { label: es ? "Fracción" : "Fraction", value: `${fmt(a)} / ${fmt(b)}` },
      ];
    }
    case "tiempo-duplicacion": {
      if (a <= 0) throw new Error(es ? "La tasa de crecimiento debe ser positiva." : "Growth rate must be positive.");
      const periods = Math.log(2) / Math.log(1 + a / 100);
      const rule72 = 72 / a;
      return [
        { label: es ? "Periodos para duplicar" : "Periods to double", value: fmt(periods) },
        { label: es ? "Aprox. regla del 72" : "Rule of 72 approx.", value: fmt(rule72) },
        {
          label: es ? "Tasa usada" : "Rate used",
          value: `${fmt(a)} % ${es ? "por periodo" : "per period"}`,
        },
      ];
    }
    case "markup-vs-margen": {
      if (mode === "markup") {
        if (a <= -100) throw new Error(es ? "El markup no puede ser ≤ −100%." : "Markup cannot be ≤ −100%.");
        const margin = (a / (100 + a)) * 100;
        return [
          { label: es ? "Markup (sobre costo)" : "Markup (on cost)", value: `${fmt(a)} %` },
          { label: es ? "Margen equivalente (sobre precio)" : "Equivalent margin (on price)", value: `${fmt(margin)} %` },
        ];
      }
      if (a >= 100) throw new Error(es ? "El margen debe ser menor que 100%." : "Margin must be under 100%.");
      const markup = (a / (100 - a)) * 100;
      return [
        { label: es ? "Margen (sobre precio)" : "Margin (on price)", value: `${fmt(a)} %` },
        { label: es ? "Markup equivalente (sobre costo)" : "Equivalent markup (on cost)", value: `${fmt(markup)} %` },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}

export const FIELD_COPY: Record<
  string,
  { a: [string, string]; b?: [string, string]; placeholders: [string, string?] }
> = {
  "porcentaje-aumento": {
    a: ["Initial value", "Valor inicial"],
    b: ["New value", "Valor nuevo"],
    placeholders: ["e.g. 80", "e.g. 100"],
  },
  "porcentaje-disminucion": {
    a: ["Original value", "Valor original"],
    b: ["New value", "Valor nuevo"],
    placeholders: ["e.g. 200", "e.g. 150"],
  },
  "diferencia-porcentual": {
    a: ["Value A", "Valor A"],
    b: ["Value B", "Valor B"],
    placeholders: ["e.g. 40", "e.g. 50"],
  },
  "porcentaje-de-porcentaje": {
    a: ["First percent (%)", "Primer porcentaje (%)"],
    b: ["Second percent (%)", "Segundo porcentaje (%)"],
    placeholders: ["e.g. 30", "e.g. 40"],
  },
  "porcentaje-hasta-meta": {
    a: ["Current amount", "Cantidad actual"],
    b: ["Goal amount", "Meta"],
    placeholders: ["e.g. 750", "e.g. 1000"],
  },
  "fraccion-a-porcentaje": {
    a: ["Numerator", "Numerador"],
    b: ["Denominator", "Denominador"],
    placeholders: ["e.g. 3", "e.g. 4"],
  },
  "tiempo-duplicacion": {
    a: ["Growth rate (% per period)", "Tasa de crecimiento (% por periodo)"],
    placeholders: ["e.g. 7"],
  },
  "markup-vs-margen": {
    a: ["Percentage", "Porcentaje"],
    placeholders: ["e.g. 50"],
  },
};
