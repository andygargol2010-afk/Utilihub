import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SimpleAverageCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("1, 2, 3, 4, 5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const nums = input
      .split(/[\s,]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => Number.isFinite(n));
    if (nums.length === 0) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    return {
      avg: Math.round(avg * 1000) / 1000,
      count: nums.length,
      sum: Math.round(sum * 1000) / 1000,
    };
  }, [input]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Promedio: ${result.avg} (${result.count} números, suma ${result.sum})`
      : `Average: ${result.avg} (${result.count} numbers, sum ${result.sum})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput("1, 2, 3, 4, 5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Promedio simple" : "Simple average"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.avg}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.count} números, suma ${result.sum}` : `${result.count} numbers, sum ${result.sum}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce números separados por comas o espacios" : "Enter numbers separated by commas or spaces"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números" : "Numbers"}</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={fieldClass}
          rows={3}
          placeholder={es ? "Ej. 10, 20, 30" : "e.g. 10, 20, 30"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Promedio = suma / cantidad. Ignora valores no numéricos."
          : "Average = sum / count. Ignores non-numeric values."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 2, 3, 4, 5 → 3" : "1, 2, 3, 4, 5 → 3"}</p>
        <p>{es ? "10, 20, 30 → 20" : "10, 20, 30 → 20"}</p>
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
          <a href={es ? "/es/calculadora-promedio-ponderado" : "/calculadora-promedio-ponderado"} className="underline">
            {es ? "Calculadora de promedio ponderado" : "Weighted average calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-media-aritmetica" : "/calculadora-media-aritmetica"} className="underline">
            {es ? "Calculadora de media aritmética" : "Arithmetic mean calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
