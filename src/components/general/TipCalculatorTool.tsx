import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TipCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [bill, setBill] = useState("50");
  const [tipPercent, setTipPercent] = useState("15");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const b = parseFloat(bill);
    const p = parseFloat(tipPercent);
    if (!Number.isFinite(b) || b < 0 || b > 100000 || !Number.isFinite(p) || p < 0 || p > 100) return null;
    const tip = Math.round(b * (p / 100) * 100) / 100;
    const total = Math.round((b + tip) * 100) / 100;
    return { tip, total };
  }, [bill, tipPercent]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Propina: ${result.tip} | Total: ${result.total}`
      : `Tip: ${result.tip} | Total: ${result.total}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBill("50");
    setTipPercent("15");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Propina y total" : "Tip and total"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{es ? `Propina: ${result.tip}` : `Tip: ${result.tip}`}</p>
            <p className="text-sm text-muted-foreground">{es ? `Total: ${result.total}` : `Total: ${result.total}`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un monto y porcentaje válidos" : "Enter a valid bill and percentage"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Monto de la cuenta" : "Bill amount"}</span>
        <input
          type="number"
          min="0"
          max="100000"
          step="0.01"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 50" : "e.g. 50"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porcentaje de propina (%)" : "Tip percentage (%)"}</span>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={tipPercent}
          onChange={(e) => setTipPercent(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 15" : "e.g. 15"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la propina y el total a pagar. Ideal para restaurantes."
          : "Calculates the tip amount and total to pay. Ideal for restaurants."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Cuenta 50, 15% → Propina 7.50, Total 57.50" : "Bill 50, 15% → Tip 7.50, Total 57.50"}</p>
        <p>{es ? "Cuenta 100, 20% → Propina 20.00, Total 120.00" : "Bill 100, 20% → Tip 20.00, Total 120.00"}</p>
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
