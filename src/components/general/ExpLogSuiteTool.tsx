"use client";

import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function fmt(n: number, d = 10) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-15) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e12) return String(n);
  if (Math.abs(n) >= 1e12 || (Math.abs(n) > 0 && Math.abs(n) < 1e-6)) return n.toExponential(6);
  return n.toPrecision(d).replace(/\.?0+$/, "");
}

type Card = { label: string; value: string };

export function ExpLogSuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [mode, setMode] = useState<"ln" | "exp">("ln");
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const run = () => {
    try {
      setError("");
      if (slug === "cambio-de-base") {
        const x = parse(a);
        const base = parse(b);
        if (!(x > 0)) throw new Error(es ? "x debe ser > 0." : "x must be > 0.");
        if (!(base > 0) || base === 1) throw new Error(es ? "La base debe ser > 0 y ≠ 1." : "Base must be > 0 and ≠ 1.");
        const val = Math.log(x) / Math.log(base);
        setCards([
          { label: `log_${fmt(base)}(${fmt(x)})`, value: fmt(val) },
          { label: "ln(x)/ln(b)", value: fmt(val) },
        ]);
        return;
      }
      if (slug === "logaritmo-natural") {
        const x = parse(a);
        if (mode === "ln") {
          if (!(x > 0)) throw new Error(es ? "x debe ser > 0 para ln." : "x must be > 0 for ln.");
          setCards([
            { label: "ln(x)", value: fmt(Math.log(x)) },
            { label: "log₁₀(x)", value: fmt(Math.log10(x)) },
          ]);
        } else {
          if (!Number.isFinite(x)) throw new Error(es ? "x inválido." : "Invalid x.");
          setCards([
            { label: "eˣ", value: fmt(Math.exp(x)) },
            { label: "exp(x)", value: fmt(Math.exp(x)) },
          ]);
        }
        return;
      }
      if (slug === "crecimiento-exponencial") {
        const A0 = parse(a);
        const k = parse(b);
        const t = parse(c);
        if (!Number.isFinite(A0) || !Number.isFinite(k) || !Number.isFinite(t))
          throw new Error(es ? "Completá A₀, k y t." : "Fill A₀, k, and t.");
        const At = A0 * Math.exp(k * t);
        setCards([
          { label: "A(t)", value: fmt(At) },
          {
            label: es ? "Tipo" : "Type",
            value: k > 0 ? (es ? "Crecimiento" : "Growth") : k < 0 ? (es ? "Decaimiento" : "Decay") : es ? "Constante" : "Constant",
          },
          { label: "A₀ e^{kt}", value: `${fmt(A0)} · e^(${fmt(k)}·${fmt(t)})` },
        ]);
      }
    } catch (e) {
      setCards(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  return (
    <div className="space-y-5">
      {slug === "logaritmo-natural" && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode("ln")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "ln" ? "bg-primary text-primary-foreground" : "border border-border"}`}>
            ln(x)
          </button>
          <button type="button" onClick={() => setMode("exp")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "exp" ? "bg-primary text-primary-foreground" : "border border-border"}`}>
            eˣ
          </button>
        </div>
      )}

      <div className={`grid gap-4 ${slug === "crecimiento-exponencial" ? "sm:grid-cols-3" : slug === "cambio-de-base" ? "sm:grid-cols-2" : "max-w-md"}`}>
        {slug === "cambio-de-base" && (
          <>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">{es ? "Argumento x" : "Argument x"}</span>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 8" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">{es ? "Base b" : "Base b"}</span>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 2" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
            </label>
          </>
        )}
        {slug === "logaritmo-natural" && (
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">x</span>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder={mode === "ln" ? "e.g. 2.718" : "e.g. 1"} className="h-12 w-full rounded-xl border border-border bg-background px-3" />
          </label>
        )}
        {slug === "crecimiento-exponencial" && (
          <>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">A₀</span>
              <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 100" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">k</span>
              <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 0.05" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">t</span>
              <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="e.g. 10" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
            </label>
          </>
        )}
      </div>

      <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
        {slug === "cambio-de-base" && "log_b(x) = ln(x)/ln(b)"}
        {slug === "logaritmo-natural" && (mode === "ln" ? "ln(x) = log_e(x)" : "eˣ = exp(x)")}
        {slug === "crecimiento-exponencial" && "A(t) = A₀ · e^{kt}"}
      </p>

      <button type="button" onClick={run} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">
        {es ? "Calcular" : "Calculate"}
      </button>

      {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{error}</p>}

      {cards && (
        <div className={`grid gap-3 ${cards.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-border bg-surface/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p className="mt-1 break-all font-mono text-xl font-semibold tabular-nums">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
