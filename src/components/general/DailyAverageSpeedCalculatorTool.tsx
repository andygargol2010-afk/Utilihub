import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DailyAverageSpeedCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distanceKm, setDistanceKm] = useState("10");
  const [timeMin, setTimeMin] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distanceKm);
    const t = parseFloat(timeMin);
    if (isNaN(d) || isNaN(t) || d <= 0 || t <= 0 || d > 10000 || t > 1440) return null;
    const hours = t / 60;
    const speed = d / hours;
    return { kmh: Number.isFinite(speed) ? speed.toFixed(2) : null };
  }, [distanceKm, timeMin]);

  async function copy() {
    if (!result?.kmh) return;
    try {
      await navigator.clipboard.writeText(result.kmh);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistanceKm("10");
    setTimeMin("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Velocidad promedio (km/h)" : "Average speed (km/h)"}</p>
        {result?.kmh != null ? (
          <p className="text-3xl font-semibold">{result.kmh} km/h</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Distancia > 0 y tiempo > 0" : "Distance > 0 and time > 0"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
          <input type="number" min="0.1" step="0.1" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tiempo (minutos)" : "Time (minutes)"}</span>
          <input type="number" min="1" step="1" value={timeMin} onChange={(e) => setTimeMin(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Velocidad = distancia / (tiempo en horas)" : "Speed = distance / (time in hours)"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "5 km en 15 min → 20.00 km/h" : "5 km in 15 min → 20.00 km/h"}</p>
        <p>{es ? "42.2 km en 240 min → 10.55 km/h" : "42.2 km in 240 min → 10.55 km/h"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result?.kmh}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
