import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CelsiusFahrenheitConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [celsius, setCelsius] = useState("20");
  const [fahrenheit, setFahrenheit] = useState("68");
  const [mode, setMode] = useState<"c2f" | "f2c">("c2f");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === "c2f") {
      const c = parseFloat(celsius);
      if (isNaN(c) || c < -273.15 || c > 1000) return null;
      const f = (c * 9 / 5) + 32;
      return { value: Math.round(f * 10) / 10, unit: "°F" };
    } else {
      const f = parseFloat(fahrenheit);
      if (isNaN(f) || f < -459.67 || f > 2000) return null;
      const c = (f - 32) * 5 / 9;
      return { value: Math.round(c * 10) / 10, unit: "°C" };
    }
  }, [celsius, fahrenheit, mode]);

  async function copy() {
    if (!result) return;
    const text = `${result.value} ${result.unit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setCelsius("20"); setFahrenheit("68"); setMode("c2f"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado de conversión" : "Conversion result"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.value} {result.unit}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={buttonClass} onClick={() => setMode("c2f")} disabled={mode === "c2f"}>
          {es ? "°C → °F" : "°C → °F"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setMode("f2c")} disabled={mode === "f2c"}>
          {es ? "°F → °C" : "°F → °C"}
        </button>
      </div>

      {mode === "c2f" ? (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Celsius (°C)" : "Celsius (°C)"}</span>
          <input type="number" step="0.1" value={celsius} onChange={(e) => setCelsius(e.target.value)} className={fieldClass} />
        </label>
      ) : (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fahrenheit (°F)" : "Fahrenheit (°F)"}</span>
          <input type="number" step="0.1" value={fahrenheit} onChange={(e) => setFahrenheit(e.target.value)} className={fieldClass} />
        </label>
      )}

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmulas: °F = (°C × 9/5) + 32; °C = (°F − 32) × 5/9." : "Formulas: °F = (°C × 9/5) + 32; °C = (°F − 32) × 5/9."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "20 °C → 68 °F" : "20 °C → 68 °F"}</p>
        <p>{es ? "100 °C → 212 °F" : "100 °C → 212 °F"}</p>
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
