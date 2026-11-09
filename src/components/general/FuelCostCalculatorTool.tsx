import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FuelCostCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("400");
  const [consumption, setConsumption] = useState("7.5");
  const [price, setPrice] = useState("1.45");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const c = parseFloat(consumption);
    const p = parseFloat(price);
    if ([d, c, p].some(isNaN) || d <= 0 || c <= 0 || p <= 0 || d > 100000 || c > 50) return null;
    const liters = (d / 100) * c;
    const cost = liters * p;
    return {
      liters: Math.round(liters * 10) / 10,
      cost: Math.round(cost * 100) / 100,
    };
  }, [distance, consumption, price]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Costo combustible: ${result.cost} (${result.liters} L)`
      : `Fuel cost: ${result.cost} (${result.liters} L)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("400");
    setConsumption("7.5");
    setPrice("1.45");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Costo total combustible" : "Total fuel cost"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.cost}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
        {result && (
          <p className="text-sm text-muted-foreground">
            {es ? `Litros: ${result.liters} L` : `Liters: ${result.liters} L`}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
          <input type="number" step="any" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Consumo (L/100km)" : "Consumption (L/100km)"}</span>
          <input type="number" step="any" min="0" value={consumption} onChange={(e) => setConsumption(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm sm:col-span-2">
          <span className="font-medium">{es ? "Precio por litro" : "Price per liter"}</span>
          <input type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "400 km, 7.5 L/100km, 1.45 → 43.50" : "400 km, 7.5 L/100km, 1.45 → 43.50"}</p>
        <p>{es ? "250 km, 6.0 L/100km, 1.60 → 24.00" : "250 km, 6.0 L/100km, 1.60 → 24.00"}</p>
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
