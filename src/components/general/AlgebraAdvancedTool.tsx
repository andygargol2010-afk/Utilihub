"use client";

import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function fmt(n: number, d = 6) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(d).replace(/\.?0+$/, "");
}

type Card = { label: string; value: string; hint?: string };

type FieldSpec = { key: string; en: string; es: string; ph: string };

const FIELDS: Record<string, FieldSpec[]> = {
  "formula-cuadratica": [
    { key: "a", en: "a (x² coeff)", es: "a (coef. x²)", ph: "e.g. 1" },
    { key: "b", en: "b (x coeff)", es: "b (coef. x)", ph: "e.g. -5" },
    { key: "c", en: "c (constant)", es: "c (constante)", ph: "e.g. 6" },
  ],
  discriminante: [
    { key: "a", en: "a", es: "a", ph: "e.g. 1" },
    { key: "b", en: "b", es: "b", ph: "e.g. -5" },
    { key: "c", en: "c", es: "c", ph: "e.g. 6" },
  ],
  "completar-cuadrado": [
    { key: "a", en: "a", es: "a", ph: "e.g. 1" },
    { key: "b", en: "b", es: "b", ph: "e.g. -6" },
    { key: "c", en: "c", es: "c", ph: "e.g. 5" },
  ],
  "sistema-ecuaciones-2x2": [
    { key: "a1", en: "a₁", es: "a₁", ph: "e.g. 2" },
    { key: "b1", en: "b₁", es: "b₁", ph: "e.g. 1" },
    { key: "c1", en: "c₁", es: "c₁", ph: "e.g. 5" },
    { key: "a2", en: "a₂", es: "a₂", ph: "e.g. 1" },
    { key: "b2", en: "b₂", es: "b₂", ph: "e.g. -1" },
    { key: "c2", en: "c₂", es: "c₂", ph: "e.g. 1" },
  ],
  "foil-binomios": [
    { key: "a", en: "a in (ax+b)", es: "a en (ax+b)", ph: "e.g. 1" },
    { key: "b", en: "b in (ax+b)", es: "b en (ax+b)", ph: "e.g. 2" },
    { key: "c", en: "c in (cx+d)", es: "c en (cx+d)", ph: "e.g. 3" },
    { key: "d", en: "d in (cx+d)", es: "d en (cx+d)", ph: "e.g. 4" },
  ],
  "factorizar-trinomio": [
    { key: "b", en: "b in x² + bx + c", es: "b en x² + bx + c", ph: "e.g. 5" },
    { key: "c", en: "c in x² + bx + c", es: "c en x² + bx + c", ph: "e.g. 6" },
  ],
  "pendiente-dos-puntos": [
    { key: "x1", en: "x₁", es: "x₁", ph: "e.g. 1" },
    { key: "y1", en: "y₁", es: "y₁", ph: "e.g. 2" },
    { key: "x2", en: "x₂", es: "x₂", ph: "e.g. 4" },
    { key: "y2", en: "y₂", es: "y₂", ph: "e.g. 8" },
  ],
};

function polyTerm(coef: number, body: string, first: boolean): string {
  if (Math.abs(coef) < 1e-12) return first ? "0" : "";
  const sign = coef < 0 ? " − " : first ? "" : " + ";
  const abs = Math.abs(coef);
  const num = abs === 1 && body ? "" : fmt(abs);
  return `${sign}${num}${body}`;
}

function compute(slug: string, v: Record<string, number>, es: boolean): Card[] {
  switch (slug) {
    case "formula-cuadratica": {
      const { a, b, c } = v;
      if (a === 0) throw new Error(es ? "a no puede ser 0 (no es cuadrática)." : "a cannot be 0 (not quadratic).");
      const disc = b * b - 4 * a * c;
      const twoA = 2 * a;
      if (disc > 0) {
        const s = Math.sqrt(disc);
        return [
          { label: es ? "Raíz x₁" : "Root x₁", value: fmt((-b + s) / twoA) },
          { label: es ? "Raíz x₂" : "Root x₂", value: fmt((-b - s) / twoA) },
          { label: es ? "Discriminante" : "Discriminant", value: fmt(disc), hint: es ? "Dos raíces reales distintas" : "Two distinct real roots" },
        ];
      }
      if (disc === 0) {
        return [
          { label: es ? "Raíz (doble)" : "Root (repeated)", value: fmt(-b / twoA) },
          { label: es ? "Discriminante" : "Discriminant", value: "0", hint: es ? "Una raíz real repetida" : "One repeated real root" },
        ];
      }
      const s = Math.sqrt(-disc);
      const real = fmt(-b / twoA);
      const imag = fmt(s / Math.abs(twoA));
      return [
        { label: es ? "Raíz x₁" : "Root x₁", value: `${real} + ${imag}i` },
        { label: es ? "Raíz x₂" : "Root x₂", value: `${real} − ${imag}i` },
        { label: es ? "Discriminante" : "Discriminant", value: fmt(disc), hint: es ? "Raíces complejas conjugadas" : "Complex conjugate roots" },
      ];
    }
    case "discriminante": {
      const { a, b, c } = v;
      if (a === 0) throw new Error(es ? "a no puede ser 0." : "a cannot be 0.");
      const disc = b * b - 4 * a * c;
      let nature: string;
      if (disc > 0) nature = es ? "Dos raíces reales distintas" : "Two distinct real roots";
      else if (disc === 0) nature = es ? "Una raíz real repetida" : "One repeated real root";
      else nature = es ? "Sin raíces reales (complejas)" : "No real roots (complex)";
      return [
        { label: "Δ = b² − 4ac", value: fmt(disc) },
        { label: es ? "Naturaleza" : "Nature", value: nature },
      ];
    }
    case "completar-cuadrado": {
      const { a, b, c } = v;
      if (a === 0) throw new Error(es ? "a no puede ser 0." : "a cannot be 0.");
      const h = -b / (2 * a);
      const k = c - (b * b) / (4 * a);
      const hStr = fmt(h);
      const kStr = fmt(k);
      const aStr = fmt(a);
      const form =
        Math.abs(a - 1) < 1e-12
          ? `(x − (${hStr}))² + (${kStr})`
          : `${aStr}(x − (${hStr}))² + (${kStr})`;
      return [
        { label: es ? "Forma vértice" : "Vertex form", value: form },
        { label: es ? "Vértice (h, k)" : "Vertex (h, k)", value: `(${hStr}, ${kStr})` },
        {
          label: es ? "Extremo" : "Extremum",
          value: a > 0 ? (es ? "Mínimo" : "Minimum") : es ? "Máximo" : "Maximum",
        },
      ];
    }
    case "sistema-ecuaciones-2x2": {
      const { a1, b1, c1, a2, b2, c2 } = v;
      const det = a1 * b2 - a2 * b1;
      const detX = c1 * b2 - c2 * b1;
      const detY = a1 * c2 - a2 * c1;
      if (Math.abs(det) < 1e-12) {
        if (Math.abs(detX) < 1e-12 && Math.abs(detY) < 1e-12) {
          return [{ label: es ? "Resultado" : "Result", value: es ? "Infinitas soluciones (misma recta)" : "Infinite solutions (same line)" }];
        }
        return [{ label: es ? "Resultado" : "Result", value: es ? "Sin solución (paralelas)" : "No solution (parallel lines)" }];
      }
      return [
        { label: "x", value: fmt(detX / det) },
        { label: "y", value: fmt(detY / det) },
        { label: es ? "Determinante" : "Determinant", value: fmt(det) },
      ];
    }
    case "foil-binomios": {
      const { a, b, c, d } = v;
      const A = a * c;
      const B = a * d + b * c;
      const C = b * d;
      let poly = polyTerm(A, "x²", true);
      poly += polyTerm(B, "x", false);
      poly += polyTerm(C, "", false);
      return [
        { label: es ? "Expandido" : "Expanded", value: poly || "0" },
        { label: "A (x²)", value: fmt(A) },
        { label: "B (x)", value: fmt(B) },
        { label: "C", value: fmt(C) },
      ];
    }
    case "factorizar-trinomio": {
      const { b, c } = v;
      if (!Number.isInteger(b) || !Number.isInteger(c)) {
        throw new Error(es ? "Esta versión busca factores enteros: usá enteros para b y c." : "This version seeks integer factors: use integers for b and c.");
      }
      const B = b;
      const C = c;
      let found: [number, number] | null = null;
      const limit = Math.max(Math.abs(C), Math.abs(B), 1);
      for (let p = -limit; p <= limit; p++) {
        if (p === 0 && C !== 0) continue;
        if (p !== 0 && C % p !== 0) continue;
        const q = p === 0 ? C : C / p;
        if (p + q === B) {
          found = [p, q];
          break;
        }
      }
      if (!found) {
        return [{ label: es ? "Resultado" : "Result", value: es ? "No hay factores enteros" : "No integer factor pair found" }];
      }
      const [p, q] = found;
      const term = (n: number) => (n >= 0 ? `(x + ${n})` : `(x − ${Math.abs(n)})`);
      return [
        { label: es ? "Factores" : "Factors", value: `${term(p)}${term(q)}` },
        { label: "p + q", value: fmt(p + q), hint: "b" },
        { label: "p × q", value: fmt(p * q), hint: "c" },
      ];
    }
    case "pendiente-dos-puntos": {
      const { x1, y1, x2, y2 } = v;
      if (x1 === x2) {
        return [
          { label: es ? "Pendiente" : "Slope", value: es ? "Indefinida" : "Undefined" },
          { label: es ? "Recta" : "Line", value: `x = ${fmt(x1)}`, hint: es ? "Vertical" : "Vertical" },
        ];
      }
      const m = (y2 - y1) / (x2 - x1);
      const intercept = y1 - m * x1;
      const pointSlope = `y − ${fmt(y1)} = ${fmt(m)}(x − ${fmt(x1)})`;
      const slopeInt = `y = ${fmt(m)}x ${intercept >= 0 ? "+" : "−"} ${fmt(Math.abs(intercept))}`;
      return [
        { label: es ? "Pendiente m" : "Slope m", value: fmt(m) },
        { label: es ? "Punto-pendiente" : "Point-slope", value: pointSlope },
        { label: es ? "Pendiente-ordenada" : "Slope-intercept", value: slopeInt },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}

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
