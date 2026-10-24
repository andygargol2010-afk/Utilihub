import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TripFuelConsumptionCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("200");
  const [consumption, setConsumption] = useState("7.5");
  const [price, setPrice] = useState("1.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const c = parseFloat(consumption);
    const p = parseFloat(price);
    if (isNaN(d) || isNaN(c) || isNaN(p) || d < 0 || d > 10000 || c < 0 || c > 50 || p < 0 || p > 10) return null;
    const liters = (d / 100) * c;
    const cost = liters * p;
    return { liters: Math.round(liters * 10) / 10, cost: Math.round(cost * 100) / 100 };
  }, [distance, consumption, price]);

  async function copy() {
    if (!result) return;
    const text = `${result.liters} L / ${result.cost}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setDistance("200"); setConsumption("7.5"); setPrice("1.5"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Litros y costo estimado" : "Estimated liters and cost"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.liters} L</p>
            <p className="text-sm text-muted-foreground">{es ? `Costo: ${result.cost}` : `Cost: ${result.cost}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos: distancia ≥0, consumo 0-50 L/100km, precio ≥0" : "Valid values: distance ≥0, consumption 0-50 L/100km, price ≥0"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
        <input type="number" step="1" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Consumo (L/100km)" : "Consumption (L/100km)"}</span>
        <input type="number" step="0.1" min="0" value={consumption} onChange={(e) => setConsumption(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Precio por litro" : "Price per liter"}</span>
        <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: litros = (distancia / 100) × consumo; costo = litros × precio." : "Formula: liters = (distance / 100) × consumption; cost = liters × price."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "200 km, 7.5 L/100km, 1.5/L → 15 L, costo 22.5" : "200 km, 7.5 L/100km, 1.5/L → 15 L, cost 22.5"}</p>
        <p>{es ? "100 km, 6 L/100km, 1.8/L → 6 L, costo 10.8" : "100 km, 6 L/100km, 1.8/L → 6 L, cost 10.8"}</p>
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
