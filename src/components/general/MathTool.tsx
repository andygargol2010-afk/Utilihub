import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

const parseNumbers = (value: string): number[] => {
  const trimmed = value.trim();
  if (!trimmed) return [];
  const tokens = trimmed.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean);
  const values = tokens.map((token) => Number(token));
  if (values.some((item) => !Number.isFinite(item))) throw new Error("Todos los datos deben ser números válidos. Usa punto para los decimales y coma, punto y coma o saltos de línea para separar valores.");
  return values;
};

const requireValues = (values: number[], minimum = 1): void => {
  if (values.length < minimum) throw new Error(`Introduce al menos ${minimum} valor${minimum === 1 ? "" : "es"} numérico${minimum === 1 ? "" : "s"}.`);
};

const percentile = (values: number[], p: number): number => {
  if (!Number.isFinite(p) || p < 0 || p > 100) throw new Error("El percentil debe estar entre 0 y 100.");
  const sorted = [...values].sort((a, b) => a - b);
  const position = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const lowerValue = sorted[lower];
  const upperValue = sorted[upper];
  if (lowerValue === undefined || upperValue === undefined) throw new Error("No hay datos suficientes para calcular el percentil.");
  return lowerValue + (upperValue - lowerValue) * (position - lower);
};

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;
const variance = (values: number[], average: number, sample: boolean): number => {
  const denominator = sample ? values.length - 1 : values.length;
  if (denominator <= 0) throw new Error("La varianza muestral requiere al menos 2 valores.");
  return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / denominator;
};

const pairedSeries = (first: number[], second: number[]): [number[], number[]] => {
  if (first.length < 2 || second.length < 2 || first.length !== second.length) throw new Error("Las dos series deben contener al menos 2 valores y tener la misma cantidad de elementos.");
  return [first, second];
};

const calculate = (slug: string, values: number[], percentileValue: number, targetValue: number, secondValues: number[], sample: boolean): string => {
  requireValues(values);
  const average = mean(values);
  switch (slug) {
    case "promedio": return `Promedio: ${average}`;
    case "mediana": {
      const sorted = [...values].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      const middleValue = sorted[middle];
      if (middleValue === undefined) throw new Error("No hay datos suficientes para calcular la mediana.");
      if (sorted.length % 2) return `Mediana: ${middleValue}`;
      const previous = sorted[middle - 1];
      if (previous === undefined) throw new Error("No hay datos suficientes para calcular la mediana.");
      return `Mediana: ${(previous + middleValue) / 2}`;
    }
    case "moda": {
      const counts = new Map<number, number>();
      values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
      const max = Math.max(...counts.values());
      if (max === 1) return "Moda: no hay valores repetidos; el conjunto es amodal.";
      return `Moda: ${[...counts.entries()].filter(([, count]) => count === max).map(([value]) => value).join(", ")}`;
    }
    case "rango": {
      const sorted = [...values].sort((a, b) => a - b);
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      if (first === undefined || last === undefined) throw new Error("No hay datos suficientes para calcular el rango.");
      return `Rango: ${last - first}`;
    }
    case "varianza": return `Varianza ${sample ? "muestral" : "poblacional"}: ${variance(values, average, sample)}`;
    case "desviacion-estandar": return `Desviación estándar ${sample ? "muestral" : "poblacional"}: ${Math.sqrt(variance(values, average, sample))}`;
    case "percentil": return `Percentil ${percentileValue}: ${percentile(values, percentileValue)}`;
    case "cuartiles": {
      const q1 = percentile(values, 25);
      const median = percentile(values, 50);
      const q3 = percentile(values, 75);
      return `Q1: ${q1} · Mediana: ${median} · Q3: ${q3} · RIC: ${q3 - q1}`;
    }
    case "z-score": {
      requireValues(values, 2);
      if (!Number.isFinite(targetValue)) throw new Error("Introduce un valor objetivo válido para el Z-score.");
      const standardDeviation = Math.sqrt(variance(values, average, false));
      if (standardDeviation === 0) throw new Error("No se puede calcular Z-score con desviación estándar cero.");
      return `Z-score de ${targetValue}: ${(targetValue - average) / standardDeviation}`;
    }
    case "correlacion": {
      const [first, second] = pairedSeries(values, secondValues);
      const firstMean = mean(first);
      const secondMean = mean(second);
      const numerator = first.reduce((sum, value, index) => {
        const paired = second[index];
        return paired === undefined ? sum : sum + (value - firstMean) * (paired - secondMean);
      }, 0);
      const denominator = Math.sqrt(first.reduce((sum, value) => sum + (value - firstMean) ** 2, 0) * second.reduce((sum, value) => sum + (value - secondMean) ** 2, 0));
      if (denominator === 0) throw new Error("No se puede calcular correlación con una serie constante.");
      return `Correlación de Pearson: ${numerator / denominator}`;
    }
    case "covarianza": {
      const [first, second] = pairedSeries(values, secondValues);
      const firstMean = mean(first);
      const secondMean = mean(second);
      const denominator = sample ? first.length - 1 : first.length;
      const sum = first.reduce((total, value, index) => {
        const paired = second[index];
        return paired === undefined ? total : total + (value - firstMean) * (paired - secondMean);
      }, 0);
      return `Covarianza ${sample ? "muestral" : "poblacional"}: ${sum / denominator}`;
    }
    default: throw new Error(`Herramienta matemática sin implementación específica: ${slug}`);
  }
};

export function MathTool({ tool }: { tool: GeneralTool }) {
  const [raw, setRaw] = useState("");
  const [secondRaw, setSecondRaw] = useState("");
  const [percentileInput, setPercentileInput] = useState("50");
  const [targetInput, setTargetInput] = useState("");
  const [sample, setSample] = useState(false);
  const [out, setOut] = useState("");
  const values = useMemo(() => {
    try { return parseNumbers(raw); } catch { return []; }
  }, [raw]);
  const secondValues = useMemo(() => {
    try { return parseNumbers(secondRaw); } catch { return []; }
  }, [secondRaw]);
  const paired = tool.slug === "correlacion" || tool.slug === "covarianza";
  const needsPercentile = tool.slug === "percentil";
  const needsTarget = tool.slug === "z-score";
  const needsSample = tool.slug === "varianza" || tool.slug === "desviacion-estandar" || tool.slug === "covarianza";

  const run = () => {
    try {
      const parsedValues = parseNumbers(raw);
      const parsedSecondValues = parseNumbers(secondRaw);
      setOut(calculate(tool.slug, parsedValues, Number(percentileInput), Number(targetInput), parsedSecondValues, sample));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo calcular el resultado.");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">{paired ? "Serie A" : "Lista de datos"}<textarea value={raw} onChange={(event) => setRaw(event.target.value)} placeholder="Ejemplo: 5, 10, 15, 20" className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-4" /></label>
      {paired && <label className="block text-sm font-semibold">Serie B<textarea value={secondRaw} onChange={(event) => setSecondRaw(event.target.value)} placeholder="Ejemplo: 3, 7, 11, 15" className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background p-4" /></label>}
      {needsPercentile && <label className="block text-sm font-semibold">Percentil (0–100)<input type="number" min="0" max="100" value={percentileInput} onChange={(event) => setPercentileInput(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>}
      {needsTarget && <label className="block text-sm font-semibold">Valor objetivo para el Z-score<input type="number" value={targetInput} onChange={(event) => setTargetInput(event.target.value)} placeholder="Ejemplo: 18" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>}
      {needsSample && <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={sample} onChange={(event) => setSample(event.target.checked)} />Usar fórmula muestral (n−1)</label>}
      <p className="text-xs text-muted-foreground">Usa punto para decimales. Se aceptan coma, punto y coma o saltos de línea como separadores; los datos inválidos se rechazan y no se descartan silenciosamente.</p>
      <button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Calcular</button>
      {out && <output aria-live="polite" className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 font-medium">{out}</output>}
    </div>
  );
}
