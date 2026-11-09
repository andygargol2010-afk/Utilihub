import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TripTimeTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("100");
  const [speed, setSpeed] = useState("80");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const s = parseFloat(speed);
    if (isNaN(d) || isNaN(s) || d <= 0 || s <= 0) return null;
    const hours = d / s;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return { hours: Math.round(hours * 100) / 100, h, m };
  }, [distance, speed]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Tiempo de viaje: ${result.h}h ${result.m}min (${result.hours} horas)`
      : `Trip time: ${result.h}h ${result.m}min (${result.hours} hours)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("100");
    setSpeed("80");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo de viaje" : "Trip time"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.h}h {result.m}min</p>
            <p className="text-sm text-muted-foreground">{es ? `${result.hours} horas totales` : `${result.hours} total hours`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce distancia y velocidad válidas" : "Enter valid distance and speed"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia" : "Distance"}</span>
          <input type="number" step="any" min="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad media" : "Average speed"}</span>
          <input type="number" step="any" min="0.1" value={speed} onChange={(e) => setSpeed(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 km a 80 km/h → 1h 15min" : "100 km at 80 km/h → 1h 15min"}</p>
        <p>{es ? "250 millas a 60 mph → ~4h 10min" : "250 miles at 60 mph → ~4h 10min"}</p>
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
