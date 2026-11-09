"use client";
import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale, type Card, parse } from "./SequenceSuiteTool.part1";
import { FIELDS, compute } from "./SequenceSuiteTool.part2";

const FORMULAS: Record<string, string> = {
  fibonacci: "F(n)=F(n−1)+F(n−2),  Σ₀ⁿ F(k)=F(n+2)−1",
  "sucesion-aritmetica": "aₙ=a₁+(n−1)d,  Sₙ=n/2·(2a₁+(n−1)d)",
  "sucesion-geometrica": "aₙ=a₁·rⁿ⁻¹,  Sₙ=a₁(1−rⁿ)/(1−r)",
  "suma-naturales-cuadrados": "Σk=n(n+1)/2,  Σk²=n(n+1)(2n+1)/6",
};

export function SequenceSuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const fields = FIELDS[tool.slug] ?? [];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const run = () => {
    try {
      setError("");
      const nums: Record<string, number> = {};
      for (const f of fields) {
        const n = parse(values[f.key] ?? "");
        if (!Number.isFinite(n))
          throw new Error(es ? "Completá todos los campos con números válidos." : "Fill all fields with valid numbers.");
        nums[f.key] = n;
      }
      setCards(compute(tool.slug, nums, es));
    } catch (e) {
      setCards(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  if (!fields.length) {
    return <p className="text-sm text-muted-foreground">{es ? "Configuración incompleta." : "Missing configuration."}</p>;
  }

  return (
    <div className="space-y-5">
      <div className={`grid gap-4 ${fields.length > 1 ? "sm:grid-cols-3" : "max-w-md"}`}>
        {fields.map((f) => (
          <label key={f.key} className="space-y-1.5">
            <span className="text-sm font-semibold">{es ? f.es : f.en}</span>
            <input
              type="number"
              inputMode="decimal"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
              placeholder={f.ph}
              className="h-12 w-full rounded-xl border border-border bg-background px-3 text-base"
            />
          </label>
        ))}
      </div>

      {FORMULAS[tool.slug] && (
        <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
          {es ? "Fórmula" : "Formula"}: {FORMULAS[tool.slug]}
        </p>
      )}

      <button type="button" onClick={run} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">
        {es ? "Calcular" : "Calculate"}
      </button>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{error}</p>
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
