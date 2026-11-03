import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function geometricMean(values: number[]): number | { error: string } {
  if (values.length === 0) return { error: "empty" };
  if (values.some((v) => !Number.isFinite(v) || v <= 0)) return { error: "positive" };
  const sumLn = values.reduce((acc, v) => acc + Math.log(v), 0);
  return Math.exp(sumLn / values.length);
}

export function GeometricMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("2, 8");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const nums = input
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);
    const r = geometricMean(nums);
    if (typeof r === "object") {
      if (r.error === "empty") return { error: es ? "Ingresa al menos un número" : "Enter at least one number" };
      return { error: es ? "Todos los valores deben ser positivos" : "All values must be positive" };
    }
    return { mean: r, count: nums.length };
  }, [input, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.mean.toFixed(4);
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput("2, 8");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.mean.toFixed(4)}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Media geométrica de ${result.count} valores` : `Geometric mean of ${result.count} values`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa números" : "Enter numbers"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Números (separados por coma o espacio)" : "Numbers (comma or space separated)"}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={fieldClass}
            placeholder={es ? "ej. 2, 8 o 1 2 4 8" : "e.g. 2, 8 or 1 2 4 8"}
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Solo números positivos. Se calcula como exp(promedio de logaritmos naturales)."
          : "Positive numbers only. Calculated as exp(average of natural logs)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>2, 8 → 4.0000</p>
        <p>1, 2, 4, 8 → 2.8284</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/media-armonica" : "/tools/media-armonica"} className="underline text-primary">
            {es ? "Media armónica" : "Harmonic mean"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/media-ponderada" : "/tools/media-ponderada"} className="underline text-primary">
            {es ? "Media ponderada" : "Weighted mean"}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
