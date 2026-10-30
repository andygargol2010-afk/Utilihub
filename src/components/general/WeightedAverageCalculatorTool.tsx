import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseList(s: string): number[] {
  return s
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => parseFloat(x))
    .filter((n) => Number.isFinite(n));
}

export function WeightedAverageCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("80, 90, 70");
  const [weightsStr, setWeightsStr] = useState("0.3, 0.5, 0.2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    const weights = parseList(weightsStr);
    if (values.length === 0 || weights.length === 0 || values.length !== weights.length) return null;
    if (values.some((v) => !Number.isFinite(v)) || weights.some((w) => !Number.isFinite(w) || w < 0)) return null;
    const sumW = weights.reduce((a, b) => a + b, 0);
    if (sumW <= 0) return null;
    const sumVW = values.reduce((acc, v, i) => acc + v * weights[i], 0);
    const avg = Math.round((sumVW / sumW) * 10000) / 10000;
    return { avg, sumW, n: values.length };
  }, [valuesStr, weightsStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Media ponderada: ${result.avg}`
      : `Weighted average: ${result.avg}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValuesStr("80, 90, 70");
    setWeightsStr("0.3, 0.5, 0.2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media ponderada" : "Weighted average"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.avg}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · suma de pesos: ${result.sumW}`
                : `${result.n} values · weight sum: ${result.sumW}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce listas válidas del mismo tamaño y pesos ≥ 0 que sumen > 0" : "Enter matching lists of the same length with non-negative weights that sum > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valores (separados por coma)" : "Values (comma-separated)"}</span>
        <input
          type="text"
          value={valuesStr}
          onChange={(e) => setValuesStr(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 80, 90, 70" : "e.g. 80, 90, 70"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Pesos (separados por coma)" : "Weights (comma-separated)"}</span>
        <input
          type="text"
          value={weightsStr}
          onChange={(e) => setWeightsStr(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 0.3, 0.5, 0.2" : "e.g. 0.3, 0.5, 0.2"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula Σ(valor × peso) / Σ(peso). Útil para notas con distinto peso o promedios ponderados."
          : "Computes Σ(value × weight) / Σ(weight). Useful for weighted grades or other weighted means."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "80, 90, 70 con pesos 0.3, 0.5, 0.2 → 83" : "80, 90, 70 with weights 0.3, 0.5, 0.2 → 83"}</p>
        <p>{es ? "100, 85, 92 con pesos 1, 2, 1 → 90.5" : "100, 85, 92 with weights 1, 2, 1 → 90.5"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a className="underline" href={es ? "/es/tools/calculadora-promedio-simple" : "/tools/calculadora-promedio-simple"}>
            {es ? "Calculadora de promedio simple" : "Simple average calculator"}
          </a>
          {" · "}
          <a className="underline" href={es ? "/es/tools/calculadora-porcentaje-de-numero" : "/tools/calculadora-porcentaje-de-numero"}>
            {es ? "Porcentaje de un número" : "Percentage of a number"}
          </a>
        </p>
      </div>
    </div>
  );
}
