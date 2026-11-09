import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ElectricityCostTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [watts, setWatts] = useState("100");
  const [hours, setHours] = useState("4");
  const [rate, setRate] = useState("0.15");
  const [days, setDays] = useState("30");
  const [copied, setCopied] = useState(false);

  const w = parseFloat(watts) || 0;
  const h = parseFloat(hours) || 0;
  const r = parseFloat(rate) || 0;
  const d = parseFloat(days) || 0;

  const dailyKwh = (w * h) / 1000;
  const dailyCost = dailyKwh * r;
  const totalCost = dailyCost * d;
  const totalKwh = dailyKwh * d;

  const result = es
    ? `Costo total (${d} días): $${totalCost.toFixed(2)} | Diario: $${dailyCost.toFixed(2)} | Total kWh: ${totalKwh.toFixed(2)}`
    : `Total cost (${d} days): $${totalCost.toFixed(2)} | Daily: $${dailyCost.toFixed(2)} | Total kWh: ${totalKwh.toFixed(2)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setWatts("100");
    setHours("4");
    setRate("0.15");
    setDays("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Costo estimado" : "Estimated cost"}</p>
        <p className="text-3xl font-semibold">${totalCost.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">
          {es ? `Diario: $${dailyCost.toFixed(2)} · ${totalKwh.toFixed(2)} kWh` : `Daily: $${dailyCost.toFixed(2)} · ${totalKwh.toFixed(2)} kWh`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Watts" : "Watts"}</span>
          <input type="number" value={watts} onChange={(e) => setWatts(e.target.value)} className={fieldClass} min="0" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Horas por día" : "Hours per day"}</span>
          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tarifa ($/kWh)" : "Rate ($/kWh)"}</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} min="0" step="0.01" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Días" : "Days"}</span>
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className={fieldClass} min="0" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: 100W, 4h/día, $0.15/kWh, 30 días → ~$1.80" : "Example 1: 100W, 4h/day, $0.15/kWh, 30 days → ~$1.80"}</p>
        <p>{es ? "Ejemplo 2: 1500W heater, 2h/día, $0.20/kWh, 7 días → ~$4.20" : "Example 2: 1500W heater, 2h/day, $0.20/kWh, 7 days → ~$4.20"}</p>
      </div>
    </div>
  );
}
