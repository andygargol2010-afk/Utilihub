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

export function HarmonicMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("1, 2, 3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    if (values.length === 0) return null;
    if (values.some((v) => !Number.isFinite(v) || v <= 0)) return null;
    const n = values.length;
    const sumInv = values.reduce((acc, v) => acc + 1 / v, 0);
    const h = n / sumInv;
    const rounded = Math.round(h * 10000) / 10000;
    return { h: rounded, n, sumInv: Math.round(sumInv * 10000) / 10000 };
  }, [valuesStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Media armónica: ${result.h}`
      : `Harmonic mean: ${result.h}`;
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
        <p className="text-sm text-muted-foreground">{es ? "Media armónica" : "Harmonic mean"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.h}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · Σ(1/x) = ${result.sumInv}`
                : `${result.n} values · Σ(1/x) = ${result.sumInv}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce al menos un número positivo finito" : "Enter at least one positive finite number"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números positivos (separados por coma)" : "Positive numbers (comma-separated)"}</span>
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
          ? "Calcula n / Σ(1/x_i). Útil para promedios de tasas, velocidades o ratios (solo números positivos)."
          : "Computes n / Σ(1/x_i). Useful for averages of rates, speeds, or ratios (positive numbers only)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 2, 3 → 1.6364" : "1, 2, 3 → 1.6364"}</p>
        <p>{es ? "2, 4 → 2.6667" : "2, 4 → 2.6667"}</p>
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
          <a className="underline" href={es ? "/es/tools/calculadora-media-cuadratica" : "/tools/calculadora-media-cuadratica"}>
            {es ? "Media cuadrática (RMS)" : "Quadratic mean (RMS)"}
          </a>
          {" · "}
          <a className="underline" href={es ? "/es/tools/calculadora-promedio-simple" : "/tools/calculadora-promedio-simple"}>
            {es ? "Promedio simple" : "Simple average"}
          </a>
        </p>
      </div>
    </div>
  );
}
