import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageIncreaseCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [oldValue, setOldValue] = useState("100");
  const [newValue, setNewValue] = useState("125");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const oldV = parseFloat(oldValue);
    const newV = parseFloat(newValue);
    if (isNaN(oldV) || isNaN(newV) || oldV <= 0 || Math.abs(newV) > 1e12) return null;
    const increase = ((newV - oldV) / oldV) * 100;
    return { pct: Math.round(increase * 100) / 100, diff: Math.round((newV - oldV) * 100) / 100 };
  }, [oldValue, newValue]);

  async function copy() {
    if (!result) return;
    const text = `${result.pct}%`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setOldValue("100"); setNewValue("125"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje de aumento" : "Percentage increase"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.pct}%</p>
            <p className="text-sm text-muted-foreground">{es ? `Diferencia: ${result.diff}` : `Difference: ${result.diff}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (valor original > 0)" : "Valid values required (original value > 0)"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor original" : "Original value"}</span>
        <input type="number" step="0.01" min="0.01" value={oldValue} onChange={(e) => setOldValue(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor nuevo" : "New value"}</span>
        <input type="number" step="0.01" value={newValue} onChange={(e) => setNewValue(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "% aumento = ((nuevo - original) / original) × 100. Puede ser negativo (disminución)." : "% increase = ((new - original) / original) × 100. Can be negative (decrease)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 → 125 = +25%" : "100 → 125 = +25%"}</p>
        <p>{es ? "200 → 150 = -25%" : "200 → 150 = -25%"}</p>
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
