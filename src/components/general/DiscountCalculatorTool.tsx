import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DiscountCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!Number.isFinite(p) || p < 0 || p > 1000000) return null;
    const dNum = Math.min(100, Math.max(0, Number.isFinite(d) ? d : 0));
    const savings = Math.round(p * (dNum / 100) * 100) / 100;
    const finalPrice = Math.round((p - savings) * 100) / 100;
    return { savings, finalPrice };
  }, [price, discount]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Ahorro: $${result.savings.toFixed(2)}\nPrecio final: $${result.finalPrice.toFixed(2)}`
      : `Savings: $${result.savings.toFixed(2)}\nFinal price: $${result.finalPrice.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrice("100");
    setDiscount("20");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultados" : "Results"}</p>
        {result ? (
          <>
            <p className="text-lg font-medium">{es ? "Ahorro" : "Savings"}: {result.savings.toFixed(2)}$</p>
            <p className="text-lg font-medium">{es ? "Precio final" : "Final price"}: {result.finalPrice.toFixed(2)}$</p>
          </>
        ) : (
          <p className="text-sm text-destructive">
            {es ? "Introduce un precio ≥ 0 y un descuento entre 0 y 100" : "Enter a price ≥ 0 and a discount between 0 and 100"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Precio original" : "Original price"}</span>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} min="0" step="0.01" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Descuento %" : "Discount %"}</span>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className={fieldClass} min="0" max="100" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
