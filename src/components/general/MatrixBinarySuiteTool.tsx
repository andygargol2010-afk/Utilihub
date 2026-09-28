"use client";

import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return String(n);
  return n.toPrecision(10).replace(/\.?0+$/, "");
}

type Card = { label: string; value: string; hint?: string };

export function MatrixBinarySuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [inputBase, setInputBase] = useState<"bin" | "dec" | "hex">("dec");
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const run = () => {
    try {
      setError("");
      if (slug === "matriz-2x2") {
        const A = parse(a), B = parse(b), C = parse(c), D = parse(d);
        if (![A, B, C, D].every(Number.isFinite))
          throw new Error(es ? "Completá a, b, c, d." : "Fill a, b, c, d.");
        const det = A * D - B * C;
        const out: Card[] = [{ label: "det(A)", value: fmt(det), hint: "ad − bc" }];
        if (Math.abs(det) < 1e-12) {
          out.push({ label: es ? "Inversa" : "Inverse", value: es ? "No existe (singular)" : "Does not exist (singular)" });
        } else {
          out.push({
            label: "A⁻¹",
            value: `[[${fmt(D / det)}, ${fmt(-B / det)}], [${fmt(-C / det)}, ${fmt(A / det)}]]`,
          });
        }
        setCards(out);
        return;
      }
      if (slug === "bases-numericas") {
        const s = raw.trim().replace(/\s+/g, "");
        if (!s) throw new Error(es ? "Ingresá un valor." : "Enter a value.");
        let n: number;
        if (inputBase === "dec") {
          n = Number(s);
          if (!Number.isInteger(n) || n < 0) throw new Error(es ? "Entero no negativo en decimal." : "Non-negative integer in decimal.");
        } else if (inputBase === "bin") {
          if (!/^[01]+$/.test(s)) throw new Error(es ? "Binario solo admite 0 y 1." : "Binary allows only 0 and 1.");
          n = parseInt(s, 2);
        } else {
          if (!/^[0-9a-fA-F]+$/.test(s)) throw new Error(es ? "Hex inválido." : "Invalid hex.");
          n = parseInt(s, 16);
        }
        if (!Number.isFinite(n) || n < 0 || n > Number.MAX_SAFE_INTEGER)
          throw new Error(es ? "Número fuera de rango seguro." : "Number out of safe range.");
        setCards([
          { label: "Decimal", value: String(n) },
          { label: es ? "Binario" : "Binary", value: n.toString(2) },
          { label: "Hex", value: n.toString(16).toUpperCase() },
        ]);
        return;
      }
      if (slug === "bitwise") {
        const x = parse(a);
        const y = parse(b);
        if (!Number.isInteger(x) || !Number.isInteger(y))
          throw new Error(es ? "Ingresá dos enteros." : "Enter two integers.");
        const and = x & y;
        const or = x | y;
        const xor = x ^ y;
        setCards([
          { label: "AND", value: `${and}`, hint: (and >>> 0).toString(2) },
          { label: "OR", value: `${or}`, hint: (or >>> 0).toString(2) },
          { label: "XOR", value: `${xor}`, hint: (xor >>> 0).toString(2) },
        ]);
      }
    } catch (e) {
      setCards(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  return (
    <div className="space-y-5">
      {slug === "matriz-2x2" && (
        <div className="grid max-w-sm grid-cols-2 gap-3">
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="a" className="h-12 rounded-xl border border-border bg-background px-3 text-center font-mono" />
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="b" className="h-12 rounded-xl border border-border bg-background px-3 text-center font-mono" />
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="c" className="h-12 rounded-xl border border-border bg-background px-3 text-center font-mono" />
          <input type="number" value={d} onChange={(e) => setD(e.target.value)} placeholder="d" className="h-12 rounded-xl border border-border bg-background px-3 text-center font-mono" />
        </div>
      )}

      {slug === "bases-numericas" && (
        <>
          <div className="flex flex-wrap gap-2">
            {(["dec", "bin", "hex"] as const).map((base) => (
              <button key={base} type="button" onClick={() => setInputBase(base)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${inputBase === base ? "bg-primary text-primary-foreground" : "border border-border"}`}>
                {base === "dec" ? "Decimal" : base === "bin" ? (es ? "Binario" : "Binary") : "Hex"}
              </button>
            ))}
          </div>
          <label className="block max-w-md space-y-1.5">
            <span className="text-sm font-semibold">{es ? "Valor de entrada" : "Input value"}</span>
            <input type="text" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={inputBase === "bin" ? "e.g. 1010" : inputBase === "hex" ? "e.g. FF" : "e.g. 255"} className="h-12 w-full rounded-xl border border-border bg-background px-3 font-mono text-base" />
          </label>
        </>
      )}

      {slug === "bitwise" && (
        <div className="grid max-w-lg gap-4 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">a</span>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. 12" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">b</span>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. 10" className="h-12 w-full rounded-xl border border-border bg-background px-3" />
          </label>
        </div>
      )}

      <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2 font-mono text-xs text-muted-foreground">
        {slug === "matriz-2x2" && "det = ad−bc;  A⁻¹ = (1/det)·[[d,−b],[−c,a]]"}
        {slug === "bases-numericas" && "bin ↔ dec ↔ hex"}
        {slug === "bitwise" && "AND & · OR | · XOR ^"}
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
              {card.hint && <p className="mt-1 font-mono text-xs text-muted-foreground">{card.hint}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
