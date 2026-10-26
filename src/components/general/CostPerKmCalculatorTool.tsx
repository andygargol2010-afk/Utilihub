import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CostPerKmCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [cost, setCost] = useState("50");
  const [km, setKm] = useState("200");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const k = parseFloat(km);
    if (!Number.isFinite(c) || !Number.isFinite(k) || c < 0 || k <= 0) return null;
    const per = c / k;
    return { per: Math.round(per * 100) / 100 };
  }, [cost, km]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Costo por km: ${result.per} (${cost} / ${km} km)`
      : `Cost per km: ${result.per} (${cost} / ${km} km)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCost("50");
    setKm("200");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Costo por kilómetro" : "Cost per kilometer"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.per}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Costo ≥ 0, km > 0" : "Cost ≥ 0, km > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Costo total" : "Total cost"}</span>
        <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={fieldClass} placeholder="50" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
        <input type="number" value={km} onChange={(e) => setKm(e.target.value)} className={fieldClass} placeholder="200" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula el costo por kilómetro para viajes o transporte." : "Calculate cost per kilometer for trips or transport."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "50 por 200 km → 0.25" : "50 for 200 km → 0.25"}</p>
        <p>{es ? "100 por 500 km → 0.20" : "100 for 500 km → 0.20"}</p>
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
