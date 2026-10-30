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

export function GeometricMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("2, 8");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    if (values.length === 0) return null;
    if (values.some((v) => !Number.isFinite(v) || v <= 0)) return null;
    const n = values.length;
    const product = values.reduce((acc, v) => acc * v, 1);
    if (!Number.isFinite(product) || product <= 0) return null;
    const g = Math.pow(product, 1 / n);
    const rounded = Math.round(g * 10000) / 10000;
    return { g: rounded, n, product: Math.round(product * 10000) / 10000 };
  }, [valuesStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Media geométrica: ${result.g}`
      : `Geometric mean: ${result.g}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValuesStr("2, 8");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media geométrica" : "Geometric mean"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.g}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · producto = ${result.product}`
                : `${result.n} values · product = ${result.product}`}
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
          placeholder={es ? "Ej. 2, 8" : "e.g. 2, 8"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula (\u03a0 x_i)^(1/n). Útil para tasas de crecimiento, porcentajes o promedios multiplicativos (solo números positivos)."
          : "Computes (\u03a0 x_i)^(1/n). Useful for growth rates, percentages, or multiplicative averages (positive numbers only)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2, 8 → 4" : "2, 8 → 4"}</p>
        <p>{es ? "1, 2, 4 → 2" : "1, 2, 4 → 2"}</p>
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
          <a className="underline" href={es ? "/es/tools/calculadora-media-armonica" : "/tools/calculadora-media-armonica"}>
            {es ? "Media armónica" : "Harmonic mean"}
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
