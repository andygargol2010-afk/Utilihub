import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function KwhCostCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [kwh, setKwh] = useState("300");
  const [rate, setRate] = useState("0.15");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const k = parseFloat(kwh);
    const r = parseFloat(rate);
    if (!Number.isFinite(k) || !Number.isFinite(r) || k < 0 || r < 0 || k > 1e6 || r > 10) return null;
    const cost = k * r;
    return { cost: Math.round(cost * 100) / 100 };
  }, [kwh, rate]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Costo mensual: $${result.cost}`
      : `Monthly cost: $${result.cost}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setKwh("300");
    setRate("0.15");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Costo de electricidad" : "Electricity cost"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">${result.cost}</p>
            <p className="text-sm text-muted-foreground">
              {es ? "Costo mensual estimado" : "Estimated monthly cost"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce kWh y tarifa válidos" : "Enter valid kWh and rate"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Consumo (kWh/mes)" : "Usage (kWh/month)"}</span>
        <input
          type="number"
          value={kwh}
          onChange={(e) => setKwh(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 300" : "e.g. 300"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tarifa ($/kWh)" : "Rate ($/kWh)"}</span>
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 0.15" : "e.g. 0.15"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula el costo mensual de electricidad a partir del consumo y la tarifa."
          : "Calculates monthly electricity cost from usage and rate."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "300 kWh a $0.15 → $45" : "300 kWh at $0.15 → $45"}</p>
        <p>{es ? "500 kWh a $0.12 → $60" : "500 kWh at $0.12 → $60"}</p>
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
