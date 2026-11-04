"use client";
import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale, type Card, parse } from "./ArithmeticSuiteTool.part1";
import { crossMultiply, compute } from "./ArithmeticSuiteTool.part2";

const FIELD_HINTS: Record<string, { fields: { key: string; en: string; es: string; ph: string }[]; formula: string }> = {
  "factorizacion-prima": {
    fields: [{ key: "n", en: "Integer n ≥ 2", es: "Entero n ≥ 2", ph: "e.g. 360" }],
    formula: "n = p₁^e₁ × p₂^e₂ × …",
  },
  "es-primo": {
    fields: [{ key: "n", en: "Integer n", es: "Entero n", ph: "e.g. 97" }],
    formula: "prime ⇔ only divisors are 1 and n",
  },
  "raiz-cubica": {
    fields: [{ key: "x", en: "Number x", es: "Número x", ph: "e.g. -8" }],
    formula: "∛x  (real cube root)",
  },
  "multiplicacion-cruzada": {
    fields: [
      { key: "a", en: "a", es: "a", ph: "e.g. 2" },
      { key: "b", en: "b", es: "b", ph: "e.g. 3" },
      { key: "c", en: "c", es: "c", ph: "e.g. 4" },
      { key: "d", en: "d", es: "d", ph: "e.g. ?" },
    ],
    formula: "a/b = c/d  →  a·d = b·c",
  },
  "division-larga": {
    fields: [
      { key: "dividend", en: "Dividend", es: "Dividendo", ph: "e.g. 100" },
      { key: "divisor", en: "Divisor", es: "Divisor", ph: "e.g. 7" },
    ],
    formula: "dividend = quotient × divisor + remainder",
  },
  "cifras-significativas": {
    fields: [
      { key: "num", en: "Number (as written)", es: "Número (como lo escribís)", ph: "e.g. 0.00340" },
      { key: "sig", en: "Round to N sig figs (optional)", es: "Redondear a N cifras (opcional)", ph: "e.g. 2" },
    ],
    formula: "count digits that carry precision",
  },
  "orden-de-magnitud": {
    fields: [{ key: "x", en: "Positive number x", es: "Número positivo x", ph: "e.g. 3500" }],
    formula: "order ≈ 10^round(log₁₀ x)",
  },
};

export function ArithmeticSuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const meta = FIELD_HINTS[slug];
  const fields = meta?.fields ?? [];

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  const [unknown, setUnknown] = useState<"a" | "b" | "c" | "d">("d");
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const run = () => {
    try {
      setError("");
      if (slug === "multiplicacion-cruzada") {
        const vals: Record<string, number> = {
          a: parse(values.a ?? ""),
          b: parse(values.b ?? ""),
          c: parse(values.c ?? ""),
          d: parse(values.d ?? ""),
        };
        setCards(crossMultiply(vals, unknown, es));
        return;
      }
      if (slug === "factorizacion-prima" || slug === "es-primo" || slug === "raiz-cubica" || slug === "orden-de-magnitud") {
        setCards(compute(slug, values[fields[0]!.key] ?? "", "", es));
        return;
      }
      if (slug === "division-larga") {
        setCards(compute(slug, values.dividend ?? "", values.divisor ?? "", es));
        return;
      }
      if (slug === "cifras-significativas") {
        setCards(compute(slug, values.num ?? "", values.sig ?? "", es));
        return;
      }
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
    } catch (e) {
      setCards(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  if (!meta) {
    return <p className="text-sm text-muted-foreground">{es ? "Configuración incompleta." : "Missing configuration."}</p>;
  }

  return (
    <div className="space-y-5">
      {slug === "multiplicacion-cruzada" && (
        <div className="flex flex-wrap gap-2">
          {(["a", "b", "c", "d"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setUnknown(k)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                unknown === k ? "bg-primary text-primary-foreground" : "border border-border bg-background"
              }`}
            >
              {es ? `Despejar ${k}` : `Solve for ${k}`}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-4 ${fields.length > 2 ? "sm:grid-cols-2" : "max-w-md"}`}>
        {fields.map((f) => {
          if (slug === "multiplicacion-cruzada" && f.key === unknown) {
            return (
              <label key={f.key} className="space-y-1.5 opacity-60">
                <span className="text-sm font-semibold">
                  {f.key} ({es ? "incógnita" : "unknown"})
                </span>
                <input disabled className="h-12 w-full rounded-xl border border-dashed bg-muted/30 px-3" placeholder="?" />
              </label>
            );
          }
          return (
            <label key={f.key} className="space-y-1.5">
              <span className="text-sm font-semibold">{es ? f.es : f.en}</span>
              <input
                type="text"
                inputMode="decimal"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.ph}
                className="h-12 w-full rounded-xl border border-border bg-background px-3 text-base"
              />
            </label>
          );
        })}
      </div>

      {meta.formula && (
        <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
          {es ? "Fórmula" : "Formula"}: {meta.formula}
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

      {cards && (
        <div className={`grid gap-3 ${cards.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-border bg-surface/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 break-all font-mono text-xl font-semibold tabular-nums">{c.value}</p>
              {c.hint && <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
