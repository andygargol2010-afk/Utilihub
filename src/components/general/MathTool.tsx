import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

const parseNumbers = (value: string): number[] =>
  value
    .split(/[\n,;]+/)
    .map((item) => Number(item.trim().replace(",", ".")))
    .filter(Number.isFinite);

const requireValues = (values: number[]): void => {
  if (values.length === 0) throw new Error("Introduce uno o varios números válidos.");
};

const percentile = (values: number[], p: number): number => {
  if (!Number.isFinite(p) || p < 0 || p > 100) {
    throw new Error("El percentil debe estar entre 0 y 100.");
  }
  const sorted = [...values].sort((a, b) => a - b);
  const position = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
};

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;
const populationVariance = (values: number[], average: number): number =>
  values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;

const calculate = (slug: string, values: number[], percentileValue?: number): string => {
  requireValues(values);
  const average = mean(values);

  switch (slug) {
    case "promedio":
      return `Promedio: ${average}`;
    case "mediana": {
      const sorted = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      return `Mediana: ${sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2}`;
    }
    case "moda": {
      const counts = new Map<number, number>();
      values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
      const max = Math.max(...counts.values());
      return max === 1
        ? "Moda: no existe una moda única."
        : `Moda: ${[...counts.entries()].filter(([, count]) => count === max).map(([value]) => value).join(", ")}`;
    }
    case "rango": {
      const sorted = [...values].sort((a, b) => a - b);
      return `Rango: ${sorted[sorted.length - 1] - sorted[0]}`;
    }
    case "varianza":
      return `Varianza poblacional: ${populationVariance(values, average)}`;
    case "desviacion-estandar":
      return `Desviación estándar poblacional: ${Math.sqrt(populationVariance(values, average))}`;
    case "percentil": {
      if (values.length < 2) throw new Error("El percentil requiere al menos dos valores.");
      const p = percentileValue ?? 50;
      return `Percentil ${p}: ${percentile(values, p)}`;
    }
    case "cuartiles":
      return `Q1: ${percentile(values, 25)} · Mediana: ${percentile(values, 50)} · Q3: ${percentile(values, 75)}`;
    case "z-score": {
      if (values.length < 2) throw new Error("El Z-score requiere al menos dos valores.");
      const standardDeviation = Math.sqrt(populationVariance(values, average));
      if (standardDeviation === 0) throw new Error("No se puede calcular Z-score con desviación estándar cero.");
      return `Z-score del primer valor (${values[0]}): ${(values[0] - average) / standardDeviation}`;
    }
    case "correlacion": {
      if (values.length < 4 || values.length % 2 !== 0) {
        throw new Error("Correlación requiere dos series con la misma cantidad de valores.");
      }
      const size = values.length / 2;
      const first = values.slice(0, size);
      const second = values.slice(size);
      const firstMean = mean(first);
      const secondMean = mean(second);
      const numerator = first.reduce((sum, value, index) => sum + (value - firstMean) * (second[index] - secondMean), 0);
      const denominator = Math.sqrt(
        first.reduce((sum, value) => sum + (value - firstMean) ** 2, 0) *
        second.reduce((sum, value) => sum + (value - secondMean) ** 2, 0),
      );
      if (denominator === 0) throw new Error("No se puede calcular correlación con una serie constante.");
      return `Correlación de Pearson: ${numerator / denominator}`;
    }
    case "covarianza": {
      if (values.length < 4 || values.length % 2 !== 0) {
        throw new Error("Covarianza requiere dos series con la misma cantidad de valores.");
      }
      const size = values.length / 2;
      const first = values.slice(0, size);
      const second = values.slice(size);
      const firstMean = mean(first);
      const secondMean = mean(second);
      return `Covarianza poblacional: ${first.reduce((sum, value, index) => sum + (value - firstMean) * (second[index] - secondMean), 0) / size}`;
    }
    default:
      throw new Error(`Herramienta matemática sin implementación específica: ${slug}`);
  }
};

export function MathTool({ tool }: { tool: GeneralTool }) {
  const [raw, setRaw] = useState("");
  const [percentileInput, setPercentileInput] = useState("50");
  const [out, setOut] = useState("");
  const values = useMemo(() => parseNumbers(raw), [raw]);

  const run = () => {
    try {
      const p = Number(percentileInput);
      setOut(calculate(tool.slug, values, p));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo calcular el resultado.");
    }
  };

  const needsPercentile = tool.slug === "percentil";
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">
        {tool.slug === "correlacion" || tool.slug === "covarianza" ? "Series A y B" : "Lista de números"}
        <textarea value={raw} onChange={(event) => setRaw(event.target.value)} placeholder="Ejemplo: 5, 10, 15, 20" className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-4" />
      </label>
      {needsPercentile && (
        <label className="block text-sm font-semibold">
          Percentil (0–100)
          <input type="number" min="0" max="100" value={percentileInput} onChange={(event) => setPercentileInput(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" />
        </label>
      )}
      <p className="text-xs text-muted-foreground">En correlación y covarianza introduce primero la serie A y después la serie B, con igual cantidad de valores.</p>
      <button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>
      {out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 font-medium">{out}</output>}
    </div>
  );
}
