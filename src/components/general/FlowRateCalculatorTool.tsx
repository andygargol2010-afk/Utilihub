import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FlowRateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [volume, setVolume] = useState("100");
  const [time, setTime] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(volume);
    const t = parseFloat(time);
    if (isNaN(v) || v < 0 || v > 1e9 || isNaN(t) || t <= 0 || t > 1e6) return null;
    const rate = v / t;
    return { rate: rate.toFixed(4) };
  }, [volume, time]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.rate);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setVolume("100");
    setTime("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Caudal (volumen/tiempo)" : "Flow rate (volume/time)"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.rate}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Volumen ≥ 0 y tiempo > 0 requeridos" : "Volume ≥ 0 and time > 0 required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Volumen (L, m³, etc.)" : "Volume (L, m³, etc.)"}</span>
        <input type="number" step="any" min="0" value={volume} onChange={(e) => setVolume(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tiempo (s, min, h)" : "Time (s, min, h)"}</span>
        <input type="number" step="any" min="0" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: Caudal = Volumen ÷ Tiempo" : "Formula: Flow rate = Volume ÷ Time"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 L / 10 min → 10 L/min" : "100 L / 10 min → 10 L/min"}</p>
        <p>{es ? "50 m³ / 2 h → 25 m³/h" : "50 m³ / 2 h → 25 m³/h"}</p>
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
