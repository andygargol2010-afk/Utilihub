"use client";

import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
const DEG = Math.PI / 180;

function parse(v: string) {
  return Number(String(v).trim().replace(",", "."));
}
function fmt(n: number, d = 8) {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-12) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e12) return String(n);
  return n.toFixed(d).replace(/\.?0+$/, "");
}
type Card = { label: string; value: string };

function normDeg(deg: number) {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}

export function TrigSuiteTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const slug = tool.slug;
  const [angle, setAngle] = useState("");
  const [mode, setMode] = useState(slug === "grados-radianes" ? "toRad" : slug === "triangulo-especial" ? "45" : "default");
  const [which, setWhich] = useState(0);
  const [side, setSide] = useState("");
  const [m, setM] = useState("");
  const [n, setN] = useState("");
  const [k, setK] = useState("1");
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);

  const run = () => {
    try {
      setError("");
      if (slug === "circulo-unitario") {
        const deg = parse(angle);
        if (!Number.isFinite(deg)) throw new Error(es ? "Ángulo inválido." : "Invalid angle.");
        const rad = deg * DEG;
        const s = Math.sin(rad), c = Math.cos(rad);
        const out: Card[] = [
          { label: "sin θ", value: fmt(s) },
          { label: "cos θ", value: fmt(c) },
          { label: es ? "Punto (x,y)" : "Point (x,y)", value: `(${fmt(c)}, ${fmt(s)})` },
        ];
        out.push({ label: "tan θ", value: Math.abs(c) < 1e-12 ? (es ? "Indefinido" : "Undefined") : fmt(s / c) });
        setCards(out);
      } else if (slug === "grados-radianes") {
        const v = parse(angle);
        if (!Number.isFinite(v)) throw new Error(es ? "Valor inválido." : "Invalid value.");
        if (mode === "toRad") {
          const rad = v * DEG;
          setCards([
            { label: es ? "Radianes" : "Radians", value: fmt(rad) },
            { label: "· π", value: fmt(rad / Math.PI) + " π" },
          ]);
        } else {
          setCards([{ label: es ? "Grados" : "Degrees", value: `${fmt(v * (180 / Math.PI))}°` }]);
        }
      } else if (slug === "angulo-referencia") {
        const deg = parse(angle);
        if (!Number.isFinite(deg)) throw new Error(es ? "Ángulo inválido." : "Invalid angle.");
        const nrm = normDeg(deg);
        let ref: number, quad: number;
        if (nrm <= 90) { ref = nrm; quad = 1; }
        else if (nrm < 180) { ref = 180 - nrm; quad = 2; }
        else if (nrm < 270) { ref = nrm - 180; quad = 3; }
        else { ref = 360 - nrm; quad = 4; }
        setCards([
          { label: es ? "Ángulo de referencia" : "Reference angle", value: `${fmt(ref)}°` },
          { label: es ? "Cuadrante" : "Quadrant", value: String(quad) },
          { label: "0–360°", value: `${fmt(nrm)}°` },
        ]);
      } else if (slug === "triangulo-especial") {
        const known = parse(side);
        if (!(known > 0)) throw new Error(es ? "El lado debe ser positivo." : "Side must be positive.");
        if (mode === "45") {
          if (which === 0) {
            setCards([
              { label: es ? "Catetos" : "Legs", value: fmt(known) },
              { label: es ? "Hipotenusa" : "Hypotenuse", value: fmt(known * Math.SQRT2) },
            ]);
          } else {
            setCards([
              { label: es ? "Catetos" : "Legs", value: fmt(known / Math.SQRT2) },
              { label: es ? "Hipotenusa" : "Hypotenuse", value: fmt(known) },
            ]);
          }
        } else {
          let x: number;
          if (which === 0) x = known;
          else if (which === 1) x = known / Math.sqrt(3);
          else x = known / 2;
          setCards([
            { label: es ? "Opuesto 30° (x)" : "Opp. 30° (x)", value: fmt(x) },
            { label: es ? "Opuesto 60° (x√3)" : "Opp. 60° (x√3)", value: fmt(x * Math.sqrt(3)) },
            { label: es ? "Hipotenusa (2x)" : "Hypotenuse (2x)", value: fmt(2 * x) },
          ]);
        }
      } else if (slug === "ternas-pitagoricas") {
        const mm = parse(m), nn = parse(n), kk = parse(k) || 1;
        if (!Number.isInteger(mm) || !Number.isInteger(nn) || mm <= nn || nn <= 0)
          throw new Error(es ? "Se requiere m > n > 0 enteros." : "Need integers m > n > 0.");
        if (!Number.isInteger(kk) || kk < 1) throw new Error(es ? "k ≥ 1 entero." : "k must be integer ≥ 1.");
        let aa = mm * mm - nn * nn;
        let bb = 2 * mm * nn;
        let cc = mm * mm + nn * nn;
        if (aa > bb) [aa, bb] = [bb, aa];
        aa *= kk; bb *= kk; cc *= kk;
        setCards([
          { label: "(a, b, c)", value: `(${aa}, ${bb}, ${cc})` },
          { label: es ? "Verificación" : "Check", value: `${aa * aa + bb * bb} = ${cc * cc}` },
        ]);
      }
    } catch (e) {
      setCards(null);
      setError(e instanceof Error ? e.message : es ? "No se pudo calcular." : "Could not calculate.");
    }
  };

  return (
    <div className="space-y-5">
      {slug === "grados-radianes" && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode("toRad")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "toRad" ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Grados → rad" : "Deg → rad"}</button>
          <button type="button" onClick={() => setMode("toDeg")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "toDeg" ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Rad → grados" : "Rad → deg"}</button>
        </div>
      )}
      {slug === "triangulo-especial" && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode("45")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "45" ? "bg-primary text-primary-foreground" : "border border-border"}`}>45-45-90</button>
            <button type="button" onClick={() => setMode("30")} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${mode === "30" ? "bg-primary text-primary-foreground" : "border border-border"}`}>30-60-90</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {mode === "45" ? (
              <>
                <button type="button" onClick={() => setWhich(0)} className={`rounded-full px-3 py-1 text-xs font-semibold ${which === 0 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Cateto" : "Leg"}</button>
                <button type="button" onClick={() => setWhich(1)} className={`rounded-full px-3 py-1 text-xs font-semibold ${which === 1 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Hipotenusa" : "Hypotenuse"}</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setWhich(0)} className={`rounded-full px-3 py-1 text-xs font-semibold ${which === 0 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Opuesto a 30°" : "Opp. 30°"}</button>
                <button type="button" onClick={() => setWhich(1)} className={`rounded-full px-3 py-1 text-xs font-semibold ${which === 1 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Opuesto a 60°" : "Opp. 60°"}</button>
                <button type="button" onClick={() => setWhich(2)} className={`rounded-full px-3 py-1 text-xs font-semibold ${which === 2 ? "bg-primary text-primary-foreground" : "border border-border"}`}>{es ? "Hipotenusa" : "Hyp"}</button>
              </>
            )}
          </div>
        </div>
      )}

      <div className={`grid gap-4 ${slug === "ternas-pitagoricas" ? "sm:grid-cols-3" : "max-w-md"}`}>
        {(slug === "circulo-unitario" || slug === "angulo-referencia" || slug === "grados-radianes") && (
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">{slug === "grados-radianes" ? (mode === "toRad" ? (es ? "Grados" : "Degrees") : (es ? "Radianes" : "Radians")) : (es ? "Ángulo (°)" : "Angle (°)")}</span>
            <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder={es ? "ej. 45" : "e.g. 45"} className="h-12 w-full rounded-xl border border-border bg-background px-3" />
          </label>
        )}
        {slug === "triangulo-especial" && (
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">{es ? "Longitud conocida" : "Known length"}</span>
            <input type="number" value={side} onChange={(e) => setSide(e.target.value)} placeholder={es ? "ej. 5" : "e.g. 5"} className="h-12 w-full rounded-xl border border-border bg-background px-3" />
          </label>
        )}
        {slug === "ternas-pitagoricas" && (
          <>
            <label className="space-y-1.5"><span className="text-sm font-semibold">m</span><input type="number" value={m} onChange={(e) => setM(e.target.value)} placeholder="2" className="h-12 w-full rounded-xl border border-border bg-background px-3" /></label>
            <label className="space-y-1.5"><span className="text-sm font-semibold">n</span><input type="number" value={n} onChange={(e) => setN(e.target.value)} placeholder="1" className="h-12 w-full rounded-xl border border-border bg-background px-3" /></label>
            <label className="space-y-1.5"><span className="text-sm font-semibold">k</span><input type="number" value={k} onChange={(e) => setK(e.target.value)} placeholder="1" className="h-12 w-full rounded-xl border border-border bg-background px-3" /></label>
          </>
        )}
      </div>

      <button type="button" onClick={run} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm">{es ? "Calcular" : "Calculate"}</button>
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
