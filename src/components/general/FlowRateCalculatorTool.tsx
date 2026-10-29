import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FlowRateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [volume, setVolume] = useState("10");
  const [time, setTime] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(volume);
    const t = parseFloat(time);
    if (isNaN(v) || isNaN(t) || v < 0 || t <= 0 || v > 1e12 || t > 1e9) return null;
    const q = v / t;
    return Math.round(q * 10000) / 10000;
  }, [volume, time]);

  async function copy() {
    if (result === null) return;
    const textOut = es
      ? `Caudal: ${result} (volumen ${volume} / tiempo ${time})`
      : `Flow rate: ${result} (volume ${volume} / time ${time})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setVolume("10");
    setTime("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Caudal (volumen / tiempo)" : "Flow rate (volume / time)"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Volumen ≥ 0, tiempo > 0 (máx razonable)" : "Volume ≥ 0, time > 0 (reasonable max)"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Volumen" : "Volume"}</span>
          <input type="number" step="0.1" min="0" value={volume} onChange={(e) => setVolume(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tiempo" : "Time"}</span>
          <input type="number" step="0.1" min="0.001" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Q = V / t. Usa unidades consistentes (ej. L y min → L/min)."
          : "Q = V / t. Use consistent units (e.g. L and min → L/min)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 L en 5 min → 2 L/min" : "10 L in 5 min → 2 L/min"}</p>
        <p>{es ? "1000 ml en 60 s → 16.6667 ml/s" : "1000 ml in 60 s → 16.6667 ml/s"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-volumen-cilindro" : "/calculadora-volumen-cilindro"} className="underline">
            {es ? "Volumen de cilindro" : "Cylinder volume"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-densidad" : "/calculadora-densidad"} className="underline">
            {es ? "Calculadora de densidad" : "Density calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
