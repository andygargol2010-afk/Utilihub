import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

const values = (s: string) => s.split(/[\n,;]+/).map((x) => Number(x.trim().replace(",", "."))).filter(Number.isFinite);
const median = (xs: number[]) => { const a = [...xs].sort((x, y) => x - y); const m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };

function calculate(slug: string, raw: string, rawB: string): string {
  const xs = values(raw);
  if (!xs.length) throw new Error("Introduce uno o varios números válidos.");
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  switch (slug) {
    case "promedio": return `Promedio: ${mean}`;
    case "mediana": return `Mediana: ${median(xs)}`;
    case "moda": { const counts = new Map<number, number>(); xs.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1)); const max = Math.max(...counts.values()); return max === 1 ? "Moda: no hay valores repetidos." : `Moda: ${[...counts].filter(([, n]) => n === max).map(([x]) => x).join(", ")}`; }
    case "rango": { const a = [...xs].sort((x, y) => x - y); return `Rango: ${a[a.length - 1] - a[0]}`; }
    case "varianza": return `Varianza poblacional: ${xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length}`;
    case "desviacion-estandar": return `Desviación estándar poblacional: ${Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length)}`;
    case "percentil": { const p = Number(rawB); if (!Number.isFinite(p) || p < 0 || p > 100) throw new Error("El percentil debe estar entre 0 y 100."); const a = [...xs].sort((x, y) => x - y); const pos = (p / 100) * (a.length - 1); const lo = Math.floor(pos); const hi = Math.ceil(pos); return `Percentil ${p}: ${a[lo] + (a[hi] - a[lo]) * (pos - lo)}`; }
    case "cuartiles": { const a = [...xs].sort((x, y) => x - y); const q2 = median(a); if (a.length === 1) return `Q1: ${a[0]}\nMediana (Q2): ${a[0]}\nQ3: ${a[0]}`; const mid = Math.floor(a.length / 2); const q1 = median(a.slice(0, mid)); const q3 = median(a.slice(a.length % 2 ? mid + 1 : mid)); return `Q1: ${q1}\nMediana (Q2): ${q2}\nQ3: ${q3}`; }
    case "z-score": { const x = Number(rawB); if (!Number.isFinite(x)) throw new Error("Introduce el valor para calcular su z-score en el segundo campo."); const sd = Math.sqrt(xs.reduce((a, v) => a + (v - mean) ** 2, 0) / xs.length); if (sd === 0) throw new Error("No se puede calcular un z-score con desviación estándar cero."); return `Z-score: ${(x - mean) / sd}`; }
    case "correlacion":
    case "covarianza": { const ys = values(rawB); if (ys.length !== xs.length || ys.length < 2) throw new Error("Las dos series deben tener la misma cantidad de valores (mínimo 2)."); const meanY = ys.reduce((a, b) => a + b, 0) / ys.length; const cov = xs.reduce((s, x, i) => s + (x - mean) * (ys[i] - meanY), 0) / xs.length; if (slug === "covarianza") return `Covarianza poblacional: ${cov}`; const sdX = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length); const sdY = Math.sqrt(ys.reduce((s, y) => s + (y - meanY) ** 2, 0) / ys.length); if (sdX === 0 || sdY === 0) throw new Error("La correlación requiere variación en ambas series."); return `Correlación de Pearson: ${cov / (sdX * sdY)}`; }
    default: throw new Error(`Herramienta estadística no implementada: ${slug}`);
  }
}

export function MathTool({ tool }: { tool: GeneralTool }) {
  const [raw, setRaw] = useState(""); const [rawB, setRawB] = useState(""); const [out, setOut] = useState(""); const [error, setError] = useState("");
  const needsSecond = ["percentil", "z-score", "correlacion", "covarianza"].includes(tool.slug);
  const calculateClick = () => { try { setError(""); setOut(calculate(tool.slug, raw, rawB)); } catch (e) { setOut(""); setError(e instanceof Error ? e.message : "No se pudo calcular el resultado."); } };
  return <div className="space-y-4">
    <div><label className="mb-2 block text-sm font-semibold">{needsSecond && ["correlacion", "covarianza"].includes(tool.slug) ? "Primera serie de datos" : "Lista de números"}</label><textarea value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="Ej.: 5, 10, 15, 20" className="min-h-28 w-full rounded-xl border border-border bg-background p-4"/><p className="mt-2 text-xs text-muted-foreground">Separa los valores con comas, punto y coma o saltos de línea.</p></div>
    {needsSecond && <div><label className="mb-2 block text-sm font-semibold">{["correlacion", "covarianza"].includes(tool.slug) ? "Segunda serie de datos" : tool.slug === "percentil" ? "Percentil (0–100)" : "Valor a estandarizar"}</label><textarea value={rawB} onChange={(e) => setRawB(e.target.value)} placeholder={["correlacion", "covarianza"].includes(tool.slug) ? "Ej.: 2, 4, 6, 8" : tool.slug === "percentil" ? "Ej.: 75" : "Ej.: 12"} className="min-h-20 w-full rounded-xl border border-border bg-background p-4"/></div>}
    <button onClick={calculateClick} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>
    {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
    {out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 font-medium">{out}</output>}
  </div>;
}
