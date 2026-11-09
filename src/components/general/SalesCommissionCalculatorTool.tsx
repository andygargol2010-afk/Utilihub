import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SalesCommissionCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [sale, setSale] = useState("1000");
  const [percent, setPercent] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = parseFloat(sale);
    const p = parseFloat(percent);
    if (!Number.isFinite(s) || s < 0 || s > 10000000 || !Number.isFinite(p) || p < 0 || p > 100) return null;
    const commission = Math.round(s * (p / 100) * 100) / 100;
    return { commission };
  }, [sale, percent]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Comisión: ${result.commission}`
      : `Commission: ${result.commission}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSale("1000");
    setPercent("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Comisión de venta" : "Sales commission"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{es ? `Comisión: ${result.commission}` : `Commission: ${result.commission}`}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un monto y porcentaje válidos" : "Enter a valid sale amount and percentage"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Monto de la venta" : "Sale amount"}</span>
        <input
          type="number"
          min="0"
          max="10000000"
          step="0.01"
          value={sale}
          onChange={(e) => setSale(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1000" : "e.g. 1000"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porcentaje de comisión (%)" : "Commission percentage (%)"}</span>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 5" : "e.g. 5"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la comisión sobre una venta. Útil para vendedores y agentes."
          : "Calculates the commission on a sale. Useful for salespeople and agents."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Venta 1000, 5% → Comisión 50.00" : "Sale 1000, 5% → Commission 50.00"}</p>
        <p>{es ? "Venta 2500, 8% → Comisión 200.00" : "Sale 2500, 8% → Commission 200.00"}</p>
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
