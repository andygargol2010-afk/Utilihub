import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WeightedMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [values, setValues] = useState("80, 90, 70");
  const [weights, setWeights] = useState("1, 2, 1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const vals = values.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    const wts = weights.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n >= 0);
    if (vals.length === 0 || wts.length === 0 || vals.length !== wts.length) return null;
    const totalWeight = wts.reduce((a, b) => a + b, 0);
    if (totalWeight === 0) return null;
    const weightedSum = vals.reduce((sum, v, i) => sum + v * wts[i], 0);
    const mean = weightedSum / totalWeight;
    return Math.round(mean * 100) / 100;
  }, [values, weights]);

  async function copy() {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(String(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValues("80, 90, 70");
    setWeights("1, 2, 1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media ponderada" : "Weighted mean"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa valores y pesos válidos" : "Enter valid values and weights"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valores (separados por coma)" : "Values (comma-separated)"}</span>
          <input type="text" value={values} onChange={(e) => setValues(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Pesos (separados por coma)" : "Weights (comma-separated)"}</span>
          <input type="text" value={weights} onChange={(e) => setWeights(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>80,90,70 with weights 1,2,1 → 82.5</p>
        <p>5,10,15 with weights 2,3,1 → 9.17</p>
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
