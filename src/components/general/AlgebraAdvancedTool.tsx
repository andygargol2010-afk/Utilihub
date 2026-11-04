"use client";
import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale, FIELDS, type Card, parse } from "./AlgebraAdvancedTool.part1";
import { compute } from "./AlgebraAdvancedTool.part2";

function formulaHint(slug: string, es: boolean): string {
  const map: Record<string, [string, string]> = {
    "formula-cuadratica": ["x = (−b ± √(b² − 4ac)) / (2a)", "x = (−b ± √(b² − 4ac)) / (2a)"],
    discriminante: ["Δ = b² − 4ac", "Δ = b² − 4ac"],
    "completar-cuadrado": ["a(x − h)² + k with h = −b/(2a)", "a(x − h)² + k con h = −b/(2a)"],
    "sistema-ecuaciones-2x2": ["x = Dx/D, y = Dy/D (Cramer)", "x = Dx/D, y = Dy/D (Cramer)"],
    "foil-binomios": ["(ax+b)(cx+d) → ac x² + (ad+bc)x + bd", "(ax+b)(cx+d) → ac x² + (ad+bc)x + bd"],
    "factorizar-trinomio": ["Find p,q with p+q=b and p·q=c", "Buscar p,q con p+q=b y p·q=c"],
    "pendiente-dos-puntos": ["m = (y₂ − y₁)/(x₂ − x₁)", "m = (y₂ − y₁)/(x₂ − x₁)"],
  };
  const pair = map[slug];
  return pair ? (es ? pair[1] : pair[0]) : "";
}

export function AlgebraAdvancedTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const fields = FIELDS[tool.slug] ?? [];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const hint = useMemo(() => formulaHint(tool.slug, es), [tool.slug, es]);

  const run = () => {
    try {
      setError("");
      const nums: Record<string, number> = {};
      for (const f of fields) {
        const n = parse(values[f.key] ?? "");
        if (!Number.isFinite(n)) throw new Error(es ? "Completá todos los campos con números válidos." : "Fill all fields with valid numbers.");
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
      <div className={`grid gap-4 ${fields.length > 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
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

      {hint && (
        <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
          {es ? "Fórmula" : "Formula"}: {hint}
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
