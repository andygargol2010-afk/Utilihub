import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

const parseNumbers = (value: string): number[] =>
  value.split(/[\n,;]+/).map((item) => Number(item.trim().replace(",", "."))).filter(Number.isFinite);

const requireValues = (values: number[]): void => {
  if (values.length === 0) throw new Error("Introduce uno o varios números válidos.");
};

const percentile = (values: number[], p: number): number => {
  if (!Number.isFinite(p) || p < 0 || p > 100) throw new Error("El percentil debe estar entre 0 y 100.");
  const sorted = [...values].sort((a, b) => a - b);
  const position = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
};

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;
const populationVariance = (values: number[], average: number): number => values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;

const pairedSeries = (first: number[], second: number[]): [number[], number[]] => {
  if (first.length < 2 || second.length < 2 || first.length !== second.length) {
    throw new Error("Las dos series deben contener al menos 2 valores y tener la misma cantidad de elementos.");
  }
  return [first, second];
};

const calculate = (slug: string, values: number[], percentileValue: number, targetValue: number, secondValues: number[]): string => {
  requireValues(values);
  const average = mean(values);
  switch (slug) {
    case "promedio": return `Promedio: ${average}`;
    case "mediana": {
      const sorted = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      return `Mediana: ${sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2}`;
    }
    case "moda": {
      const counts = new Map<number, number>();
      values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
      const max = Math.max(...counts.values());
      return max === 1 ? "Moda: no existe una moda única." : `Moda: ${[...counts.entries()].filter(([, count]) => count === max).map(([value]) => value).join(", ")}`;
    }
    case "rango": {
      const sorted = [...values].sort((a, b) => a - b);
      return `Rango: ${sorted[sorted.length - 1] - sorted[0]}`;
    }
    case "varianza": return `Varianza poblacional: ${populationVariance(values, average)}`;
    case "desviacion-estandar": return `Desviación estándar poblacional: ${Math.sqrt(populationVariance(values, average))}`;
    case "percentil": return `Percentil ${percentileValue}: ${percentile(values, percentileValue)}`;
    case "cuartiles": return `Q1: ${percentile(values, 25)} · Mediana: ${percentile(values, 50)} · Q3: ${percentile(values, 75)} · RIC: ${percentile(values, 75) - percentile(values, 25)}`;
    case "z-score": {
      if (values.length < 2 || !Number.isFinite(targetValue)) throw new Error("Introduce al menos dos valores y un valor objetivo válido.");
      const standardDeviation = Math.sqrt(populationVariance(values, average));
      if (standardDeviation === 0) throw new Error("No se puede calcular Z-score con desviación estándar cero.");
      return `Z-score de ${targetValue}: ${(targetValue - average) / standardDeviation}`;
    }
    case "correlacion": {
      const [first, second] = pairedSeries(values, secondValues);
      const firstMean = mean(first), secondMean = mean(second);
      const numerator = first.reduce((sum, value, index) => sum + (value - firstMean) * (second[index] - secondMean), 0);
      const denominator = Math.sqrt(first.reduce((sum, value) => sum + (value - firstMean) ** 2, 0) * second.reduce((sum, value) => sum + (value - secondMean) ** 2, 0));
      if (denominator === 0) throw new Error("No se puede calcular correlación con una serie constante.");
      return `Correlación de Pearson: ${numerator / denominator}`;
    }
    case "covarianza": {
      const [first, second] = pairedSeries(values, secondValues);
      const firstMean = mean(first), secondMean = mean(second);
      return `Covarianza poblacional: ${first.reduce((sum, value, index) => sum + (value - firstMean) * (second[index] - secondMean), 0) / first.length}`;
    }
    default: throw new Error(`Herramienta matemática sin implementación específica: ${slug}`);
  }
};

export function MathTool({ tool }: { tool: GeneralTool }) {
  const [raw, setRaw] = useState("");
  const [secondRaw, setSecondRaw] = useState("");
  const [percentileInput, setPercentileInput] = useState("50");
  const [targetInput, setTargetInput] = useState("");
  const [out, setOut] = useState("");
  const values = useMemo(() => parseNumbers(raw), [raw]);
  const secondValues = useMemo(() => parseNumbers(secondRaw), [secondRaw]);
  const paired = tool.slug === "correlacion" || tool.slug === "covarianza";
  const needsPercentile = tool.slug === "percentil";
  const needsTarget = tool.slug === "z-score";

  const run = () => {
    try {
      const p = Number(percentileInput);
      const target = Number(targetInput);
      setOut(calculate(tool.slug, values, p, target, secondValues));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo calcular el resultado.");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">
        {paired ? "Serie A" : "Lista de datos"}
        <textarea value={raw} onChange={(event) => setRaw(event.target.value)} placeholder="Ejemplo: 5, 10, 15, 20" className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-4" />
      </label>
      {paired && <label className="block text-sm font-semibold">Serie B<textarea value={secondRaw} onChange={(event) => setSecondRaw(event.target.value)} placeholder="Ejemplo: 3, 7, 11, 15" className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-4" /></label>}
      {needsPercentile && <label className="block text-sm font-semibold">Percentil (0–100)<input type="number" min="0" max="100" value={percentileInput} onChange={(event) => setPercentileInput(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>}
      {needsTarget && <label className="block text-sm font-semibold">Valor objetivo para el Z-score<input type="number" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} placeholder="Ejemplo: 18" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>}
      <p className="text-xs text-muted-foreground">{paired ? "Las series deben tener la misma cantidad de datos. La correlación usa Pearson y la covarianza se calcula como poblacional." : "Se aceptan valores separados por coma, punto y coma o saltos de línea. Los datos se interpretan como números reales."}</p>
      <button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>
      {out && <output aria-live="polite" className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 font-medium">{out}</output>}
    </div>
  );
}
