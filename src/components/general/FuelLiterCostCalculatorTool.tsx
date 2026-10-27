import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FuelLiterCostCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [pricePerLiter, setPricePerLiter] = useState("1.50");
  const [liters, setLiters] = useState("40");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(pricePerLiter);
    const l = parseFloat(liters);
    if (!Number.isFinite(p) || !Number.isFinite(l) || p < 0 || l < 0) return null;
    const total = p * l;
    return { total: Math.round(total * 100) / 100 };
  }, [pricePerLiter, liters]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Costo total: ${result.total} (precio ${pricePerLiter}/L \u00d7 ${liters} L)`
      : `Total cost: ${result.total} (price ${pricePerLiter}/L \u00d7 ${liters} L)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPricePerLiter("1.50");
    setLiters("40");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Costo total" : "Total cost"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.total}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Precio \u2265 0, litros \u2265 0" : "Price \u2265 0, liters \u2265 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Precio por litro" : "Price per liter"}</span>
        <input type="number" value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} className={fieldClass} placeholder="1.50" step="0.01" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Litros" : "Liters"}</span>
        <input type="number" value={liters} onChange={(e) => setLiters(e.target.value)} className={fieldClass} placeholder="40" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula el costo total de combustible multiplicando el precio por litro por la cantidad de litros." : "Calculate the total fuel cost by multiplying the price per liter by the number of liters."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1.50 /L \u00d7 40 L \u2192 60.00" : "1.50 /L \u00d7 40 L \u2192 60.00"}</p>
        <p>{es ? "1.80 /L \u00d7 50 L \u2192 90.00" : "1.80 /L \u00d7 50 L \u2192 90.00"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
