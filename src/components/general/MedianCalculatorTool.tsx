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

export function MedianCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("1, 3, 5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    let median: number;
    if (n % 2 === 1) {
      median = sorted[Math.floor(n / 2)];
    } else {
      const mid1 = sorted[n / 2 - 1];
      const mid2 = sorted[n / 2];
      median = (mid1 + mid2) / 2;
    }
    const rounded = Math.round(median * 10000) / 10000;
    return { median: rounded, n, sorted: sorted.map((v) => Math.round(v * 100) / 100).join(", ") };
  }, [valuesStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Mediana: ${result.median}`
      : `Median: ${result.median}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValuesStr("1, 3, 5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Mediana" : "Median"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.median}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · ordenados: ${result.sorted}`
                : `${result.n} values · sorted: ${result.sorted}`}
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
          placeholder={es ? "Ej. 1, 3, 5" : "e.g. 1, 3, 5"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Ordena los números y toma el valor central (o el promedio de los dos centrales si la cantidad es par). Útil para datos con valores atípicos."
          : "Sorts the numbers and takes the middle value (or average of the two middle ones for even count). Useful for data with outliers."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 3, 5 → 3" : "1, 3, 5 → 3"}</p>
        <p>{es ? "1, 2, 3, 4 → 2.5" : "1, 2, 3, 4 → 2.5"}</p>
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
            {es ? "Promedio simple" : "Simple average"}
          </a>
          {" · "}
          <a className="underline" href={es ? "/es/tools/calculadora-desviacion-absoluta-media" : "/tools/calculadora-desviacion-absoluta-media"}>
            {es ? "Desviación absoluta media" : "Mean absolute deviation"}
          </a>
        </p>
      </div>
    </div>
  );
}
