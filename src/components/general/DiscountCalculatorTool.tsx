import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DiscountCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [price, setPrice] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [copied, setCopied] = useState(false);

  const priceNum = parseFloat(price) || 0;
  const discountNum = Math.min(100, Math.max(0, parseFloat(discount) || 0));

  const savings = priceNum * (discountNum / 100);
  const finalPrice = priceNum - savings;

  async function copy() {
    const text = es
      ? `Ahorro: $${savings.toFixed(2)}\nPrecio final: $${finalPrice.toFixed(2)}`
      : `Savings: $${savings.toFixed(2)}\nFinal price: $${finalPrice.toFixed(2)}`;
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
        <p className="text-lg font-medium">{es ? "Ahorro" : "Savings"}: ${savings.toFixed(2)}</p>
        <p className="text-lg font-medium">{es ? "Precio final" : "Final price"}: ${finalPrice.toFixed(2)}</p>
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
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
