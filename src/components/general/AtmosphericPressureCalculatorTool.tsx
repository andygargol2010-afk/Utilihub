import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function AtmosphericPressureCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [altitude, setAltitude] = useState("0");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(altitude);
    if (isNaN(a) || a < -500 || a > 20000) return null;
    // Approximate barometric formula for pressure in hPa
    const pressure = 1013.25 * Math.pow(1 - 0.0065 * a / 288.15, 5.255);
    return Math.round(pressure * 100) / 100;
  }, [altitude]);

  async function copy() {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(`${result}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAltitude("0");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Presión atmosférica (hPa)" : "Atmospheric pressure (hPa)"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Altitud entre -500 y 20000 m" : "Altitude between -500 and 20000 m"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altitud (metros)" : "Altitude (meters)"}</span>
        <input
          type="number"
          step="any"
          min="-500"
          max="20000"
          value={altitude}
          onChange={(e) => setAltitude(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Aproximación de la fórmula barométrica para la presión al nivel del mar estándar." : "Approximate barometric formula for standard sea-level pressure."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "0 m → 1013.25 hPa" : "0 m → 1013.25 hPa"}</p>
        <p>{es ? "1000 m → ≈898.7 hPa" : "1000 m → ≈898.7 hPa"}</p>
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
