"use client";

import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function fmt(n: number, d = 10) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  if (Math.abs(n) >= 1e15 || (Math.abs(n) > 0 && Math.abs(n) < 1e-6)) return n.toExponential(6);
  return n.toPrecision(d).replace(/\.?0+$/, "");
}

type Card = { label: string; value: string; hint?: string };

function fibExact(n: number): { fn: number; sum: number; approx: boolean } {
  if (n === 0) return { fn: 0, sum: 0, approx: false };
  if (n === 1) return { fn: 1, sum: 1, approx: false };
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  let s0 = 0;
  let s1 = 1;
  for (let i = 2; i <= n + 2; i++) {
    const c = s0 + s1;
    s0 = s1;
    s1 = c;
  }
  return { fn: b, sum: s1 - 1, approx: n > 70 };
}

function compute(slug: string, vals: Record<string, number>, es: boolean): Card[] {
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

const FIELDS: Record<string, { key: string; en: string; es: string; ph: string }[]> = {
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
