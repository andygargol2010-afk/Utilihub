import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function AccelerationTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [u, setU] = useState("0");
  const [v, setV] = useState("20");
  const [t, setT] = useState("5");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [copied, setCopied] = useState(false);

  const initial = parseFloat(u) || 0;
  const final = parseFloat(v) || 0;
  const time = parseFloat(t) || 0;

  const accel = time > 0 ? (final - initial) / time : null;
  const accelPrimary = accel !== null ? (unit === "metric" ? accel : accel * 3.28084) : null;
  const accelSecondary = accel !== null ? (unit === "metric" ? accel * 3.28084 : accel) : null;
  const primaryUnit = unit === "metric" ? "m/s²" : "ft/s²";
  const secondaryUnit = unit === "metric" ? "ft/s²" : "m/s²";

  const result = accelPrimary !== null
    ? es
      ? `Aceleración: ${accelPrimary.toFixed(2)} ${primaryUnit} (${accelSecondary?.toFixed(2)} ${secondaryUnit})`
      : `Acceleration: ${accelPrimary.toFixed(2)} ${primaryUnit} (${accelSecondary?.toFixed(2)} ${secondaryUnit})`
    : es ? "Tiempo debe ser mayor que 0" : "Time must be greater than 0";

  async function copy() {
    if (accelPrimary === null) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setU("0");
    setV("20");
    setT("5");
    setUnit("metric");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Aceleración" : "Acceleration"}</p>
        <p className="text-3xl font-semibold">
          {accelPrimary !== null ? `${accelPrimary.toFixed(2)} ${primaryUnit}` : "—"}
        </p>
        {accelSecondary !== null && (
          <p className="text-sm text-muted-foreground">{accelSecondary.toFixed(2)} {secondaryUnit}</p>
        )}
        {time <= 0 && <p className="text-sm text-amber-600">{es ? "El tiempo no puede ser cero o negativo" : "Time cannot be zero or negative"}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad inicial" : "Initial velocity"}</span>
          <input type="number" value={u} onChange={(e) => setU(e.target.value)} className={fieldClass} step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad final" : "Final velocity"}</span>
          <input type="number" value={v} onChange={(e) => setV(e.target.value)} className={fieldClass} step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tiempo (s)" : "Time (s)"}</span>
          <input type="number" value={t} onChange={(e) => setT(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidades" : "Units"}</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "metric" | "imperial")} className={fieldClass}>
            <option value="metric">{es ? "Métrico (m/s, m/s²)" : "Metric (m/s, m/s²)"}</option>
            <option value="imperial">{es ? "Imperial (ft/s, ft/s²)" : "Imperial (ft/s, ft/s²)"}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={accelPrimary === null}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: de 0 a 20 m/s en 5 s → 4 m/s²" : "Example 1: from 0 to 20 m/s in 5 s → 4 m/s²"}</p>
        <p>{es ? "Ejemplo 2: de 10 a 0 m/s en 2 s → -5 m/s² (desaceleración)" : "Example 2: from 10 to 0 m/s in 2 s → -5 m/s² (deceleration)"}</p>
      </div>
    </div>
  );
}
