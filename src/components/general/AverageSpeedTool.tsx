import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function AverageSpeedTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("100");
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("0");
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const [copied, setCopied] = useState(false);

  const d = parseFloat(distance) || 0;
  const h = parseFloat(hours) || 0;
  const m = parseFloat(minutes) || 0;
  const totalHours = h + m / 60;

  const speed = totalHours > 0 ? d / totalHours : 0;
  const speedMph = unit === "km" ? speed * 0.621371 : speed;
  const speedKmh = unit === "mi" ? speed * 1.60934 : speed;

  const primary = unit === "km" ? speed : speed;
  const primaryUnit = unit === "km" ? "km/h" : "mph";
  const secondary = unit === "km" ? speedMph : speedKmh;
  const secondaryUnit = unit === "km" ? "mph" : "km/h";

  const result = es
    ? `Velocidad media: ${primary.toFixed(2)} ${primaryUnit} (${secondary.toFixed(2)} ${secondaryUnit})`
    : `Average speed: ${primary.toFixed(2)} ${primaryUnit} (${secondary.toFixed(2)} ${secondaryUnit})`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setDistance("100");
    setHours("2");
    setMinutes("0");
    setUnit("km");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Velocidad media" : "Average speed"}</p>
        <p className="text-3xl font-semibold">{primary.toFixed(2)} {primaryUnit}</p>
        <p className="text-sm text-muted-foreground">
          {secondary.toFixed(2)} {secondaryUnit}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? `Distancia (${unit})` : `Distance (${unit})`}</span>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad" : "Unit"}</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "km" | "mi")} className={fieldClass}>
            <option value="km">{es ? "Kilómetros (km/h)" : "Kilometers (km/h)"}</option>
            <option value="mi">{es ? "Millas (mph)" : "Miles (mph)"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Horas" : "Hours"}</span>
          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} min="0" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Minutos" : "Minutes"}</span>
          <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} className={fieldClass} min="0" max="59" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: 100 km en 2 h → 50 km/h" : "Example 1: 100 km in 2 h → 50 km/h"}</p>
        <p>{es ? "Ejemplo 2: 60 mi en 1 h 30 min → 40 mph" : "Example 2: 60 mi in 1 h 30 min → 40 mph"}</p>
      </div>
    </div>
  );
}
