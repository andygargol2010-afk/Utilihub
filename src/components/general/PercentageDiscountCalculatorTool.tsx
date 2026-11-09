import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageDiscountCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (isNaN(p) || isNaN(d) || p < 0 || p > 1e9 || d < 0 || d > 100) return null;
    const savings = (d / 100) * p;
    const final = p - savings;
    return { savings: Math.round(savings * 100) / 100, final: Math.round(final * 100) / 100 };
  }, [price, discount]);

  async function copy() {
    if (!result) return;
    const text = `${result.final}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setPrice("100"); setDiscount("20"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Precio final y ahorro" : "Final price and savings"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.final}</p>
            <p className="text-sm text-muted-foreground">{es ? `Ahorro: ${result.savings}` : `Savings: ${result.savings}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos: precio ≥0, descuento 0-100" : "Valid values: price ≥0, discount 0-100"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Precio original" : "Original price"}</span>
        <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Descuento (%)" : "Discount (%)"}</span>
        <input type="number" step="0.1" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: ahorro = (descuento / 100) × precio; final = precio - ahorro." : "Formula: savings = (discount / 100) × price; final = price - savings."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 con 20% → final 80, ahorro 20" : "100 with 20% → final 80, savings 20"}</p>
        <p>{es ? "50 con 15% → final 42.5, ahorro 7.5" : "50 with 15% → final 42.5, savings 7.5"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar precio final" : "Copy final price"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
