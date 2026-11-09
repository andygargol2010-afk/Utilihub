import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RoiCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [cost, setCost] = useState("1000");
  const [gain, setGain] = useState("1500");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const g = parseFloat(gain);
    if (isNaN(c) || isNaN(g) || c <= 0 || g < 0 || c > 1e12 || g > 1e12) return null;
    const roi = ((g - c) / c) * 100;
    return { roi: roi.toFixed(2), profit: (g - c).toFixed(2) };
  }, [cost, gain]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.roi}%`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCost("1000");
    setGain("1500");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Retorno de inversión (ROI)" : "Return on Investment (ROI)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.roi}%</p>
            <p className="text-sm text-muted-foreground">{es ? `Ganancia neta: ${result.profit}` : `Net profit: ${result.profit}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (costo > 0)" : "Valid values required (cost > 0)"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Costo de la inversión" : "Investment cost"}</span>
          <input type="number" min="0.01" step="any" value={cost} onChange={(e) => setCost(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ganancia / valor final" : "Gain / final value"}</span>
          <input type="number" min="0" step="any" value={gain} onChange={(e) => setGain(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: ROI % = ((Ganancia − Costo) / Costo) × 100" : "Formula: ROI % = ((Gain − Cost) / Cost) × 100"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Costo 1000, ganancia 1500 → 50.00%" : "Cost 1000, gain 1500 → 50.00%"}</p>
        <p>{es ? "Costo 5000, ganancia 4000 → -20.00%" : "Cost 5000, gain 4000 → -20.00%"}</p>
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
