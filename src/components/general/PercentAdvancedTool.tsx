"use client";

import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function fmt(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return String(n);
  const t = n.toFixed(digits).replace(/\.?0+$/, "");
  return t;
}

type ResultCard = { label: string; value: string; hint?: string };

function compute(slug: string, a: number, b: number, mode: string, es: boolean): ResultCard[] {
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

const FIELD_COPY: Record<
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

export function PercentAdvancedTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const copy = FIELD_COPY[slug];
  const needsB = Boolean(copy?.b);
  const isMarkup = slug === "markup-vs-margen";

  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [mode, setMode] = useState<"markup" | "margin">("markup");
  const [error, setError] = useState("");
  const [results, setResults] = useState<ResultCard[] | null>(null);

  const formulaHint = useMemo(() => {
    if (es) {
      switch (slug) {
        case "porcentaje-aumento":
          return "((nuevo − inicial) ÷ inicial) × 100";
        case "porcentaje-disminucion":
          return "((inicial − nuevo) ÷ inicial) × 100";
        case "diferencia-porcentual":
          return "|A − B| ÷ ((A + B) / 2) × 100";
        case "porcentaje-de-porcentaje":
          return "(p₁ × p₂) ÷ 100";
        case "porcentaje-hasta-meta":
          return "(actual ÷ meta) × 100";
        case "fraccion-a-porcentaje":
          return "(numerador ÷ denominador) × 100";
        case "tiempo-duplicacion":
          return "ln(2) ÷ ln(1 + r/100)";
        case "markup-vs-margen":
          return mode === "markup"
            ? "margen = markup ÷ (100 + markup) × 100"
            : "markup = margen ÷ (100 − margen) × 100";
        default:
          return "";
      }
    }
    switch (slug) {
      case "porcentaje-aumento":
        return "((new − initial) ÷ initial) × 100";
      case "porcentaje-disminucion":
        return "((initial − new) ÷ initial) × 100";
      case "diferencia-porcentual":
        return "|A − B| ÷ ((A + B) / 2) × 100";
      case "porcentaje-de-porcentaje":
        return "(p₁ × p₂) ÷ 100";
      case "porcentaje-hasta-meta":
        return "(current ÷ goal) × 100";
      case "fraccion-a-porcentaje":
        return "(numerator ÷ denominator) × 100";
      case "tiempo-duplicacion":
        return "ln(2) ÷ ln(1 + r/100)";
      case "markup-vs-margen":
        return mode === "markup"
          ? "margin = markup ÷ (100 + markup) × 100"
          : "markup = margin ÷ (100 − margin) × 100";
      default:
        return "";
    }
  }, [slug, mode, es]);

  const run = () => {
    try {
      setError("");
      const na = parse(a);
      const nb = needsB ? parse(b) : 0;
      if (!Number.isFinite(na) || (needsB && !Number.isFinite(nb))) {
        throw new Error(es ? "Introduce números válidos en todos los campos." : "Enter valid numbers in all fields.");
      }
      setResults(compute(slug, na, nb, mode, es));
    } catch (e) {
      setResults(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  if (!copy) {
    return <p className="text-sm text-muted-foreground">{es ? "Configuración incompleta." : "Missing configuration."}</p>;
  }

  return (
    <div className="space-y-5">
      {isMarkup && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("markup")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              mode === "markup" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
            }`}
          >
            {es ? "Tengo markup %" : "I have markup %"}
          </button>
          <button
            type="button"
            onClick={() => setMode("margin")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              mode === "margin" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
            }`}
          >
            {es ? "Tengo margen %" : "I have margin %"}
          </button>
        </div>
      )}

      <div className={`grid gap-4 ${needsB ? "sm:grid-cols-2" : "max-w-md"}`}>
        <label className="space-y-1.5">
          <span className="text-sm font-semibold">{es ? copy.a[1] : copy.a[0]}</span>
          <input
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder={copy.placeholders[0]}
            className="h-12 w-full rounded-xl border border-border bg-background px-3 text-base"
          />
        </label>
        {needsB && copy.b && (
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">{es ? copy.b[1] : copy.b[0]}</span>
            <input
              type="number"
              inputMode="decimal"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder={copy.placeholders[1]}
              className="h-12 w-full rounded-xl border border-border bg-background px-3 text-base"
            />
          </label>
        )}
      </div>

      {formulaHint && (
        <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
          {es ? "Fórmula" : "Formula"}: {formulaHint}
        </p>
      )}

      <button
        type="button"
        onClick={run}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm"
      >
        {es ? "Calcular" : "Calculate"}
      </button>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      {results && (
        <div className="grid gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.label} className="rounded-2xl border border-border bg-surface/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{r.label}</p>
              <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{r.value}</p>
              {r.hint && <p className="mt-1 text-xs text-muted-foreground">{r.hint}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
