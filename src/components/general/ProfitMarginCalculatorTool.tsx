import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ProfitMarginCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [cost, setCost] = useState("50");
  const [selling, setSelling] = useState("80");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const s = parseFloat(selling);
    if (isNaN(c) || isNaN(s) || c < 0 || s <= 0) return null;
    const profit = s - c;
    const margin = (profit / s) * 100;
    return {
      profit: Math.round(profit * 100) / 100,
      margin: Math.round(margin * 100) / 100,
    };
  }, [cost, selling]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Margen: ${result.margin}% | Beneficio: ${result.profit}`
      : `Margin: ${result.margin}% | Profit: ${result.profit}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCost("50");
    setSelling("80");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Margen de beneficio" : "Profit margin"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.margin}%</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Beneficio: ${result.profit}` : `Profit: ${result.profit}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce costo ≥ 0 y precio de venta > 0" : "Enter cost ≥ 0 and selling price > 0"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Costo" : "Cost"}</span>
          <input type="number" step="any" min="0" value={cost} onChange={(e) => setCost(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Precio de venta / Ingreso" : "Selling price / Revenue"}</span>
          <input type="number" step="any" min="0" value={selling} onChange={(e) => setSelling(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Costo 50, venta 80 → margen 37.5%, beneficio 30" : "Cost 50, selling 80 → margin 37.5%, profit 30"}</p>
        <p>{es ? "Costo 20, venta 25 → margen 20%, beneficio 5" : "Cost 20, selling 25 → margin 20%, profit 5"}</p>
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
