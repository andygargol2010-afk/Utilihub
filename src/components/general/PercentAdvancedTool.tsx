"use client";
import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale, parse } from "./PercentAdvancedTool.part1";
import { FIELD_COPY, type ResultCard, compute } from "./PercentAdvancedTool.part2";

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
            className={`min-h-11 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              mode === "markup" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
            }`}
          >
            {es ? "Tengo markup %" : "I have markup %"}
          </button>
          <button
            type="button"
            onClick={() => setMode("margin")}
            className={`min-h-11 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
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
        className="min-h-11 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm"
      >
        {es ? "Calcular" : "Calculate"}
      </button>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <div aria-live="polite">
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
    </div>
  );
}
