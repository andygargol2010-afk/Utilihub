import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TargetHeartRateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [intensity, setIntensity] = useState("70");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const i = parseFloat(intensity);
    if (!Number.isFinite(a) || !Number.isFinite(i) || a < 10 || a > 100 || i < 40 || i > 100) return null;
    const maxHr = 220 - a;
    const target = Math.round(maxHr * (i / 100));
    return { maxHr, target };
  }, [age, intensity]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `FC máx: ${result.maxHr} bpm | Objetivo: ${result.target} bpm`
      : `Max HR: ${result.maxHr} bpm | Target: ${result.target} bpm`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAge("30");
    setIntensity("70");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Frecuencia cardíaca objetivo" : "Target heart rate"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.target} bpm</p>
            <p className="text-sm text-muted-foreground">
              {es ? `FC máxima: ${result.maxHr} bpm` : `Max HR: ${result.maxHr} bpm`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Edad 10–100, intensidad 40–100%" : "Age 10–100, intensity 40–100%"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Edad (años)" : "Age (years)"}</span>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} placeholder="30" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Intensidad (%)" : "Intensity (%)"}</span>
        <input type="number" value={intensity} onChange={(e) => setIntensity(e.target.value)} className={fieldClass} placeholder="70" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula la frecuencia cardíaca objetivo para entrenamiento (fórmula 220 - edad)." : "Calculate target heart rate for training (220 - age formula)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "30 años, 70% → 133 bpm (FC máx 190)" : "30 years, 70% → 133 bpm (max 190)"}</p>
        <p>{es ? "40 años, 60% → 108 bpm (FC máx 180)" : "40 years, 60% → 108 bpm (max 180)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
