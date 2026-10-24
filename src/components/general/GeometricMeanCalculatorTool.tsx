import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function GeometricMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [numbers, setNumbers] = useState("2, 8, 4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const parts = numbers.split(/[,;\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (parts.length === 0 || parts.some(n => n <= 0)) return null;
    const product = parts.reduce((a, b) => a * b, 1);
    const geo = Math.pow(product, 1 / parts.length);
    return { geo: Math.round(geo * 100) / 100, count: parts.length };
  }, [numbers]);

  async function copy() {
    if (!result) return;
    const text = `${result.geo}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setNumbers("2, 8, 4"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media geométrica" : "Geometric mean"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.geo}</p>
            <p className="text-sm text-muted-foreground">{es ? `de ${result.count} valores` : `from ${result.count} values`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce números positivos separados por coma" : "Enter positive numbers separated by commas"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (positivos)" : "Numbers (positive)"}</span>
        <input type="text" value={numbers} onChange={(e) => setNumbers(e.target.value)} className={fieldClass} placeholder="2, 8, 4" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Media geométrica = raíz n-ésima del producto de los valores. Útil para tasas de crecimiento." : "Geometric mean = n-th root of the product of the values. Useful for growth rates."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2, 8 → 4" : "2, 8 → 4"}</p>
        <p>{es ? "1, 3, 9 → 3" : "1, 3, 9 → 3"}</p>
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
