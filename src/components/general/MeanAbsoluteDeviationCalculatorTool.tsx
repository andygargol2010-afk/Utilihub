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

export function MeanAbsoluteDeviationCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("1, 2, 3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    if (values.length === 0) return null;
    const n = values.length;
    const mean = values.reduce((acc, v) => acc + v, 0) / n;
    const sumAbs = values.reduce((acc, v) => acc + Math.abs(v - mean), 0);
    const mad = sumAbs / n;
    const rounded = Math.round(mad * 10000) / 10000;
    return { mad: rounded, n, mean: Math.round(mean * 10000) / 10000 };
  }, [valuesStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Desviación absoluta media (MAD): ${result.mad}`
      : `Mean absolute deviation (MAD): ${result.mad}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValuesStr("1, 2, 3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Desviación absoluta media (MAD)" : "Mean absolute deviation (MAD)"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.mad}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · media = ${result.mean}`
                : `${result.n} values · mean = ${result.mean}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce al menos un número finito" : "Enter at least one finite number"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (separados por coma)" : "Numbers (comma-separated)"}</span>
        <input
          type="text"
          value={valuesStr}
          onChange={(e) => setValuesStr(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1, 2, 3" : "e.g. 1, 2, 3"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula (1/n) Σ |x_i - media|. Más robusta a valores atípicos que la desviación estándar."
          : "Computes (1/n) Σ |x_i - mean|. More robust to outliers than standard deviation."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 2, 3 → 0.6667" : "1, 2, 3 → 0.6667"}</p>
        <p>{es ? "10, 20 → 5" : "10, 20 → 5"}</p>
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
          <a className="underline" href={es ? "/es/tools/calculadora-media-cuadratica" : "/tools/calculadora-media-cuadratica"}>
            {es ? "Media cuadrática (RMS)" : "Quadratic mean (RMS)"}
          </a>
        </p>
      </div>
    </div>
  );
}
