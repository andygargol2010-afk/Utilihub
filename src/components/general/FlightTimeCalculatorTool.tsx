import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FlightTimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("500");
  const [speed, setSpeed] = useState("800");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const s = parseFloat(speed);
    if (isNaN(d) || isNaN(s) || d <= 0 || s <= 0 || d > 20000 || s > 2000) return null;
    const hours = d / s;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return { hours: hours.toFixed(2), display: `${h}h ${m}m` };
  }, [distance, speed]);

  async function copy() {
    if (!result) return;
    const textOut = result.display;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("500");
    setSpeed("800");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo de vuelo estimado" : "Estimated flight time"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.display}</p>
            <p className="text-sm text-muted-foreground">{result.hours} h</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
          <input type="number" min="1" max="20000" value={distance} onChange={(e) => setDistance(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad (km/h)" : "Speed (km/h)"}</span>
          <input type="number" min="1" max="2000" value={speed} onChange={(e) => setSpeed(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: tiempo = distancia / velocidad" : "Formula: time = distance / speed"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "500 km, 800 km/h → 0h 38m" : "500 km, 800 km/h → 0h 38m"}</p>
        <p>{es ? "1000 km, 900 km/h → 1h 7m" : "1000 km, 900 km/h → 1h 7m"}</p>
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
