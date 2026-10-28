import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MarkupCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [cost, setCost] = useState("50");
  const [markup, setMarkup] = useState("60");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const m = parseFloat(markup);
    if (isNaN(c) || isNaN(m) || c < 0 || m < -100 || m > 10000) return null;
    const selling = c * (1 + m / 100);
    const profit = selling - c;
    return {
      selling: Math.round(selling * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    };
  }, [cost, markup]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Precio de venta: ${result.selling} | Beneficio: ${result.profit}`
      : `Selling price: ${result.selling} | Profit: ${result.profit}`;
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
    setMarkup("60");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Precio de venta con markup" : "Selling price with markup"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.selling}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Beneficio: ${result.profit}` : `Profit: ${result.profit}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Costo ≥ 0 y markup ≥ -100" : "Cost ≥ 0 and markup ≥ -100"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Costo" : "Cost"}</span>
          <input type="number" step="any" min="0" value={cost} onChange={(e) => setCost(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Markup (%)" : "Markup (%)"}</span>
          <input type="number" step="any" min="-100" max="10000" value={markup} onChange={(e) => setMarkup(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: precio = costo × (1 + markup/100). Útil para fijar precios de venta." : "Formula: price = cost × (1 + markup/100). Useful for setting selling prices."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Costo 50, markup 60% → precio 80, beneficio 30" : "Cost 50, markup 60% → price 80, profit 30"}</p>
        <p>{es ? "Costo 100, markup 25% → precio 125, beneficio 25" : "Cost 100, markup 25% → price 125, profit 25"}</p>
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
          <a href={es ? "/es/calculadora-interes-simple" : "/calculadora-interes-simple"} className="underline">
            {es ? "Calculadora de interés simple" : "Simple interest calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-descuento-sucesivo" : "/calculadora-descuento-sucesivo"} className="underline">
            {es ? "Calculadora de descuento sucesivo" : "Successive discount calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
