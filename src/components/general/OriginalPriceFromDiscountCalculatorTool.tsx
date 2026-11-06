import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function OriginalPriceFromDiscountCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [finalPrice, setFinalPrice] = useState("80");
  const [discount, setDiscount] = useState("20");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(finalPrice);
    const d = parseFloat(discount);
    if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(d) || d < 0 || d >= 100) return null;
    const original = p / (1 - d / 100);
    return {
      original: Math.round(original * 100) / 100,
      saved: Math.round((original - p) * 100) / 100,
    };
  }, [finalPrice, discount]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Precio final ${finalPrice} con ${discount}% off → Original: ${result.original} (ahorro ${result.saved})`
      : `Final price ${finalPrice} after ${discount}% off → Original: ${result.original} (saved ${result.saved})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setFinalPrice("80");
    setDiscount("20");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Precio original antes del descuento" : "Original price before discount"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold font-mono">{result.original}</p>
            <p className="text-sm text-muted-foreground">{es ? `Ahorro: ${result.saved}` : `Saved: ${result.saved}`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá un precio final positivo y un descuento entre 0 y 99.99%" : "Enter a positive final price and a discount between 0 and 99.99%"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Precio final (con descuento)" : "Final price (after discount)"}</span>
          <input
            type="number"
            step="any"
            min="0.01"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Descuento (%)" : "Discount (%)"}</span>
          <input
            type="number"
            step="any"
            min="0"
            max="99.99"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "80 con 20% off → original 100 (ahorro 20)" : "80 after 20% off → original 100 (saved 20)"}</p>
        <p>{es ? "45 con 10% off → original 50 (ahorro 5)" : "45 after 10% off → original 50 (saved 5)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: calculadora-descuento, calculadora-markup" : "Related: calculadora-descuento, calculadora-markup"}
      </p>
    </div>
  );
}
