"use client";

import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  const t = String(v).trim();
  if (!t) return Number.NaN;
  return Number(t.replace(",", "."));
}

function fmt(n: number, d = 8) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-15) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  const t = n.toPrecision(d).replace(/\.?0+e/, "e");
  return t;
}

type Card = { label: string; value: string; hint?: string };

function factorize(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let x = n;
  while (x % 2 === 0) {
    factors.set(2, (factors.get(2) ?? 0) + 1);
    x /= 2;
  }
  for (let p = 3; p * p <= x; p += 2) {
    while (x % p === 0) {
      factors.set(p, (factors.get(p) ?? 0) + 1);
      x /= p;
    }
  }
  if (x > 1) factors.set(x, (factors.get(x) ?? 0) + 1);
  return factors;
}

function isPrime(n: number): boolean {
  if (n <= 1 || !Number.isInteger(n)) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function nextPrime(n: number): number {
  let x = Math.max(2, Math.ceil(n));
  if (x === n && isPrime(n)) return n;
  if (x <= 2) return 2;
  if (x % 2 === 0) x++;
  while (!isPrime(x)) x += 2;
  return x;
}

function countSigFigs(raw: string): number {
  const s = raw.trim().replace(",", ".").toLowerCase();
  if (!s) return 0;
  const sci = s.match(/^([+-]?\d*\.?\d+)e[+-]?\d+$/);
  const body = sci ? sci[1]! : s;
  const digits = body.replace(/^[+-]/, "").replace(".", "");
  if (body.includes(".")) {
    const stripped = digits.replace(/^0+/, "");
    return stripped.length || 0;
  }
  const noLead = digits.replace(/^0+/, "");
  const noTrail = noLead.replace(/0+$/, "");
  return noTrail.length || (noLead.length ? 1 : 0);
}

function roundSigFigs(n: number, sig: number): number {
  if (!Number.isFinite(n) || n === 0) return n;
  if (sig < 1) throw new Error("sig");
  const d = Math.ceil(Math.log10(Math.abs(n)));
  const power = sig - d;
  const magnitude = Math.pow(10, power);
  return Math.round(n * magnitude) / magnitude;
}

function compute(slug: string, a: string, b: string, es: boolean): Card[] {
  switch (slug) {
    case "factorizacion-prima": {
      const n = parse(a);
      if (!Number.isInteger(n) || n < 2)
        throw new Error(es ? "Ingresá un entero ≥ 2." : "Enter an integer ≥ 2.");
      if (n > 1e12) throw new Error(es ? "Número demasiado grande para el navegador." : "Number too large for the browser.");
      const factors = factorize(n);
      const parts: string[] = [];
      for (const [p, e] of factors) {
        parts.push(e === 1 ? String(p) : `${p}^${e}`);
      }
      const product = parts.join(" × ");
      return [
        { label: es ? "Factores primos" : "Prime factors", value: product },
        { label: es ? "Cantidad de primos distintos" : "Distinct primes", value: String(factors.size) },
        { label: es ? "Verificación" : "Check", value: `${n} = ${product}` },
      ];
    }
    case "es-primo": {
      const n = parse(a);
      if (!Number.isInteger(n)) throw new Error(es ? "Ingresá un entero." : "Enter an integer.");
      if (Math.abs(n) > 1e12) throw new Error(es ? "Número demasiado grande." : "Number too large.");
      const abs = Math.abs(n);
      let status: string;
      if (abs <= 1) status = es ? "Ni primo ni compuesto" : "Neither prime nor composite";
      else if (isPrime(abs)) status = es ? "Primo" : "Prime";
      else status = es ? "Compuesto" : "Composite";
      const nextGt = isPrime(abs) ? nextPrime(abs + 1) : nextPrime(abs);
      return [
        { label: es ? "Estado" : "Status", value: status },
        { label: es ? "Siguiente primo ≥ |n|" : "Next prime ≥ |n|", value: String(nextPrime(abs)) },
        { label: es ? "Siguiente primo > |n|" : "Next prime > |n|", value: String(nextGt) },
      ];
    }
    case "raiz-cubica": {
      const x = parse(a);
      if (!Number.isFinite(x)) throw new Error(es ? "Número inválido." : "Invalid number.");
      const root = Math.cbrt(x);
      return [
        { label: es ? "Raíz cúbica" : "Cube root", value: fmt(root) },
        { label: es ? "Verificación (root³)" : "Check (root³)", value: fmt(root * root * root) },
      ];
    }
    case "division-larga": {
      const dividend = parse(a);
      const divisor = parse(b);
      if (!Number.isFinite(dividend) || !Number.isFinite(divisor))
        throw new Error(es ? "Ingresá números válidos." : "Enter valid numbers.");
      if (divisor === 0) throw new Error(es ? "El divisor no puede ser 0." : "Divisor cannot be 0.");
      if (!Number.isInteger(dividend) || !Number.isInteger(divisor))
        throw new Error(es ? "Esta versión usa enteros." : "This version uses integers.");
      const q = Math.trunc(dividend / divisor);
      const r = dividend - q * divisor;
      return [
        { label: es ? "Cociente" : "Quotient", value: String(q) },
        { label: es ? "Resto" : "Remainder", value: String(r) },
        { label: es ? "Comprobación" : "Check", value: `${dividend} = ${q} × ${divisor} + ${r}` },
      ];
    }
    case "cifras-significativas": {
      if (!a.trim()) throw new Error(es ? "Ingresá un número." : "Enter a number.");
      const count = countSigFigs(a);
      if (count < 1) throw new Error(es ? "No se detectaron cifras significativas." : "No significant figures detected.");
      const n = parse(a);
      if (!Number.isFinite(n)) throw new Error(es ? "Número inválido." : "Invalid number.");
      const cards: Card[] = [{ label: es ? "Cifras significativas" : "Significant figures", value: String(count) }];
      if (b.trim()) {
        const sig = parse(b);
        if (!Number.isInteger(sig) || sig < 1 || sig > 15)
          throw new Error(es ? "Las cifras objetivo deben ser un entero entre 1 y 15." : "Target sig figs must be an integer from 1 to 15.");
        cards.push({ label: es ? "Redondeado" : "Rounded", value: fmt(roundSigFigs(n, sig), sig + 2) });
      }
      return cards;
    }
    case "orden-de-magnitud": {
      const x = parse(a);
      if (!(x > 0)) throw new Error(es ? "Ingresá un número positivo." : "Enter a positive number.");
      const log10 = Math.log10(x);
      const floor = Math.floor(log10 + 1e-15);
      const nearest = Math.round(log10);
      return [
        { label: "log₁₀(x)", value: fmt(log10) },
        { label: es ? "Orden (piso)" : "Order (floor)", value: `10^${floor}` },
        { label: es ? "Potencia más cercana" : "Nearest power", value: `10^${nearest}` },
      ];
    }
    default:
      throw new Error(es ? "Herramienta no configurada." : "Tool not configured.");
  }
}

function crossMultiply(vals: Record<string, number>, unknown: string, es: boolean): Card[] {
  const { a, b, c, d } = vals;
  const need = (k: string) => {
    if (!Number.isFinite(vals[k]!))
      throw new Error(es ? "Completá los tres valores conocidos." : "Fill the three known values.");
  };
  if (unknown === "d") {
    need("a"); need("b"); need("c");
    if (a === 0) throw new Error(es ? "a no puede ser 0 al despejar d." : "a cannot be 0 when solving for d.");
    const dSol = (b * c) / a;
    return [
      { label: "d", value: fmt(dSol) },
      { label: es ? "Proporción" : "Proportion", value: `${fmt(a)}/${fmt(b)} = ${fmt(c)}/${fmt(dSol)}` },
    ];
  }
  if (unknown === "c") {
    need("a"); need("b"); need("d");
    if (b === 0) throw new Error(es ? "b no puede ser 0." : "b cannot be 0.");
    const cSol = (a * d) / b;
    return [
      { label: "c", value: fmt(cSol) },
      { label: es ? "Proporción" : "Proportion", value: `${fmt(a)}/${fmt(b)} = ${fmt(cSol)}/${fmt(d)}` },
    ];
  }
  if (unknown === "b") {
    need("a"); need("c"); need("d");
    if (c === 0) throw new Error(es ? "c no puede ser 0." : "c cannot be 0.");
    const bSol = (a * d) / c;
    return [
      { label: "b", value: fmt(bSol) },
      { label: es ? "Proporción" : "Proportion", value: `${fmt(a)}/${fmt(bSol)} = ${fmt(c)}/${fmt(d)}` },
    ];
  }
  need("b"); need("c"); need("d");
  if (d === 0) throw new Error(es ? "d no puede ser 0." : "d cannot be 0.");
  const aSol = (b * c) / d;
  return [
    { label: "a", value: fmt(aSol) },
    { label: es ? "Proporción" : "Proportion", value: `${fmt(aSol)}/${fmt(b)} = ${fmt(c)}/${fmt(d)}` },
  ];
}

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
