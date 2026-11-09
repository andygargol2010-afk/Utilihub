import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ElectricityConsumptionTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [watts, setWatts] = useState("100");
  const [hours, setHours] = useState("5");
  const [price, setPrice] = useState("0.15");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(watts);
    const h = parseFloat(hours);
    const p = parseFloat(price);
    if (isNaN(w) || isNaN(h) || isNaN(p) || w <= 0 || w > 10000 || h <= 0 || h > 24 || p < 0 || p > 10) return null;
    const kwh = (w * h) / 1000;
    const cost = kwh * p;
    return { kwh: kwh.toFixed(2), cost: cost.toFixed(2) };
  }, [watts, hours, price]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.kwh} kWh → ${result.cost}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWatts("100");
    setHours("5");
    setPrice("0.15");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Consumo diario" : "Daily consumption"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.kwh} kWh → {result.cost}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Potencia (W)" : "Power (W)"}</span>
          <input type="number" min="1" max="10000" value={watts} onChange={(e) => setWatts(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Horas/día" : "Hours/day"}</span>
          <input type="number" step="0.1" min="0.1" max="24" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm sm:col-span-2">
          <span className="font-medium">{es ? "Precio por kWh" : "Price per kWh"}</span>
          <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 W, 5 h, 0.15 → 0.50 kWh → 0.08" : "100 W, 5 h, 0.15 → 0.50 kWh → 0.08"}</p>
        <p>{es ? "60 W, 8 h, 0.20 → 0.48 kWh → 0.10" : "60 W, 8 h, 0.20 → 0.48 kWh → 0.10"}</p>
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
