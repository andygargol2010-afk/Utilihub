import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function UnitPriceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [price, setPrice] = useState("12.99");
  const [quantity, setQuantity] = useState("6");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(price);
    const q = parseFloat(quantity);
    if (isNaN(p) || isNaN(q) || p < 0 || q <= 0 || q > 1000000) return null;
    const unit = p / q;
    return {
      unit: Math.round(unit * 10000) / 10000,
    };
  }, [price, quantity]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Precio por unidad: ${result.unit}`
      : `Price per unit: ${result.unit}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrice("12.99");
    setQuantity("6");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Precio por unidad" : "Price per unit"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.unit}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Precio ≥ 0 y cantidad > 0" : "Price ≥ 0 and quantity > 0"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Precio total" : "Total price"}</span>
          <input type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Quantity"}</span>
          <input type="number" step="any" min="0.0001" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: precio unitario = precio total / cantidad. Útil para comparar ofertas." : "Formula: unit price = total price / quantity. Useful for comparing offers."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Precio 12.99, cantidad 6 → 2.165 por unidad" : "Price 12.99, quantity 6 → 2.165 per unit"}</p>
        <p>{es ? "Precio 5, cantidad 250 → 0.02 por unidad" : "Price 5, quantity 250 → 0.02 per unit"}</p>
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
          <a href={es ? "/es/calculadora-markup" : "/calculadora-markup"} className="underline">
            {es ? "Calculadora de markup" : "Markup calculator"}
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
