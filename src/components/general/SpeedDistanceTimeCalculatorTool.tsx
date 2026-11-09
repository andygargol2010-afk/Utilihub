import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SpeedDistanceTimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("100");
  const [time, setTime] = useState("2");
  const [unit, setUnit] = useState("kmh");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance);
    const t = parseFloat(time);
    if (!Number.isFinite(d) || d < 0 || d > 1e7 || !Number.isFinite(t) || t <= 0 || t > 1e6) return null;
    const speed = d / t;
    let display = speed;
    let unitLabel = "km/h";
    if (unit === "ms") {
      display = speed / 3.6;
      unitLabel = "m/s";
    } else if (unit === "mph") {
      display = speed * 0.621371;
      unitLabel = "mph";
    }
    return { speed: Math.round(display * 100) / 100, unitLabel };
  }, [distance, time, unit]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Velocidad: ${result.speed} ${result.unitLabel}`
      : `Speed: ${result.speed} ${result.unitLabel}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("100");
    setTime("2");
    setUnit("kmh");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Velocidad" : "Speed"}</p>
        {result ? (
          <p className="text-3xl font-semibold">
            {result.speed} {result.unitLabel}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce distancia y tiempo válidos (tiempo > 0)" : "Enter valid distance and time (time > 0)"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
        <input
          type="number"
          min="0"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 100" : "e.g. 100"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tiempo (horas)" : "Time (hours)"}</span>
        <input
          type="number"
          min="0.01"
          step="0.1"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 2" : "e.g. 2"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Unidad de velocidad" : "Speed unit"}</span>
        <select value={unit} onChange={(e) => setUnit(e.target.value)} className={fieldClass}>
          <option value="kmh">km/h</option>
          <option value="mph">mph</option>
          <option value="ms">m/s</option>
        </select>
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la velocidad promedio a partir de distancia y tiempo. Fórmula: v = d / t."
          : "Calculates average speed from distance and time. Formula: v = d / t."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 km en 2 h → 50 km/h" : "100 km in 2 h → 50 km/h"}</p>
        <p>{es ? "60 km en 1.5 h → 40 km/h" : "60 km in 1.5 h → 40 km/h"}</p>
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
