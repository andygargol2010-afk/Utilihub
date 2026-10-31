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

export function StatisticalRangeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("1, 5, 3, 9");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    if (values.length === 0) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const rounded = Math.round(range * 10000) / 10000;
    return { range: rounded, min: Math.round(min * 100) / 100, max: Math.round(max * 100) / 100, n: values.length };
  }, [valuesStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Rango: ${result.range}`
      : `Range: ${result.range}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValuesStr("1, 5, 3, 9");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Rango estadístico" : "Statistical range"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.range}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · mín ${result.min} · máx ${result.max}`
                : `${result.n} values · min ${result.min} · max ${result.max}`}
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
          placeholder={es ? "Ej. 1, 5, 3, 9" : "e.g. 1, 5, 3, 9"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "El rango es la diferencia entre el valor máximo y el mínimo. Medida simple de dispersión."
          : "The range is the difference between the maximum and minimum values. A simple measure of dispersion."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 5, 3, 9 → 8" : "1, 5, 3, 9 → 8"}</p>
        <p>{es ? "10, 10, 10 → 0" : "10, 10, 10 → 0"}</p>
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
          <a className="underline" href={es ? "/es/tools/calculadora-mediana" : "/tools/calculadora-mediana"}>
            {es ? "Mediana" : "Median"}
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
