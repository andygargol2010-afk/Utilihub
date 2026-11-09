import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function EstimatedArrivalTimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("150");
  const [speed, setSpeed] = useState("90");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const s = parseFloat(speed);
    if (!Number.isFinite(d) || !Number.isFinite(s) || d <= 0 || s <= 0) return null;
    const hours = d / s;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return { hours, h, m, totalMinutes: Math.round(hours * 60) };
  }, [distance, speed]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Tiempo estimado: ${result.h}h ${result.m}min (${result.totalMinutes} min) para ${distance} km a ${speed} km/h`
      : `Estimated time: ${result.h}h ${result.m}min (${result.totalMinutes} min) for ${distance} km at ${speed} km/h`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("150");
    setSpeed("90");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo estimado de llegada" : "Estimated arrival time"}</p>
        {result ? (
          <>
            <p className="text-2xl font-semibold font-mono">{result.h}h {result.m}min</p>
            <p className="text-sm text-muted-foreground">{es ? `Total: ${result.totalMinutes} minutos` : `Total: ${result.totalMinutes} minutes`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Distancia y velocidad deben ser números positivos" : "Distance and speed must be positive numbers"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Velocidad promedio (km/h)" : "Average speed (km/h)"}</span>
        <input
          type="number"
          min="1"
          step="1"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "150 km a 90 km/h → 1h 40min" : "150 km at 90 km/h → 1h 40min"}</p>
        <p>{es ? "50 km a 50 km/h → 1h 0min" : "50 km at 50 km/h → 1h 0min"}</p>
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
        {es ? "Relacionado: calculadora-distancia-haversine, calculadora-costo-por-km" : "Related: calculadora-distancia-haversine, calculadora-costo-por-km"}
      </p>
    </div>
  );
}
