"use client";
import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale, FIELDS, type Card, parse } from "./GeometrySuiteTool.part1";
import { compute } from "./GeometrySuiteTool.part2";

function formulaHint(slug: string, mode: string): string {
  const map: Record<string, string> = {
    "formula-heron": "Area = √[s(s−a)(s−b)(s−c)], s = (a+b+c)/2",
    "triangulo-rectangulo":
      mode === "legs" ? "c = √(a² + b²), angles via atan" : "other leg = √(c² − leg²)",
    "ley-de-senos": "a / sin(A) = b / sin(B) = c / sin(C)",
    "ley-de-cosenos":
      mode === "side" ? "c² = a² + b² − 2ab cos(C)" : "cos(C) = (a² + b² − c²) / (2ab)",
    "distancia-dos-puntos": "d = √[(x₂−x₁)² + (y₂−y₁)²]",
    "punto-medio": "M = ((x₁+x₂)/2, (y₁+y₂)/2)",
    "area-poligono-regular": "Area = (n·s²) / (4·tan(π/n))",
    "area-elipse": "Area = π·a·b",
  };
  return map[slug] ?? "";
}

export function GeometrySuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const fields = FIELDS[slug] ?? [];
  const needsMode = slug === "triangulo-rectangulo" || slug === "ley-de-cosenos";

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""])),
  );
  const [mode, setMode] = useState(slug === "ley-de-cosenos" ? "side" : "legs");
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const visibleFields = useMemo(() => {
    if (slug === "triangulo-rectangulo") {
      if (mode === "legs") return fields;
      return [
        { key: "a", en: "Known leg", es: "Cateto conocido", ph: "e.g. 3" },
        { key: "b", en: "Hypotenuse", es: "Hipotenusa", ph: "e.g. 5" },
      ];
    }
    if (slug === "ley-de-cosenos") {
      return [
        { key: "a", en: "Side a", es: "Lado a", ph: "e.g. 5" },
        { key: "b", en: "Side b", es: "Lado b", ph: "e.g. 6" },
        mode === "side"
          ? { key: "cOrC", en: "Angle C (°)", es: "Ángulo C (°)", ph: "e.g. 60" }
          : { key: "cOrC", en: "Side c", es: "Lado c", ph: "e.g. 7" },
      ];
    }
    return fields;
  }, [slug, mode, fields]);

  const hint = useMemo(() => formulaHint(slug, mode), [slug, mode]);

  const run = () => {
    try {
      setError("");
      const nums: Record<string, number> = {};
      for (const f of visibleFields) {
        const raw = values[f.key] ?? "";
        if (slug === "ley-de-senos" && (f.key === "b" || f.key === "B") && raw.trim() === "") {
          nums[f.key] = NaN;
          continue;
        }
        const n = parse(raw);
        if (!Number.isFinite(n))
          throw new Error(es ? "Completá los campos requeridos con números válidos." : "Fill required fields with valid numbers.");
        nums[f.key] = n;
      }
      setCards(compute(slug, nums, mode, es));
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
      {needsMode && (
        <div className="flex flex-wrap gap-2">
          {slug === "triangulo-rectangulo" && (
            <>
              <button
                type="button"
                onClick={() => setMode("legs")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "legs" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Dos catetos" : "Two legs"}
              </button>
              <button
                type="button"
                onClick={() => setMode("leg-hyp")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "leg-hyp" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Cateto + hipotenusa" : "Leg + hypotenuse"}
              </button>
            </>
          )}
          {slug === "ley-de-cosenos" && (
            <>
              <button
                type="button"
                onClick={() => setMode("side")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "side" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Hallar lado c" : "Find side c"}
              </button>
              <button
                type="button"
                onClick={() => setMode("angle")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  mode === "angle" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                }`}
              >
                {es ? "Hallar ángulo C" : "Find angle C"}
              </button>
            </>
          )}
        </div>
      )}

      <div className={`grid gap-4 ${visibleFields.length > 3 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
        {visibleFields.map((f) => (
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
