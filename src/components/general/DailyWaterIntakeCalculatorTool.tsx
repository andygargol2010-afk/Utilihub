import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DailyWaterIntakeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [weight, setWeight] = useState("70");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!Number.isFinite(w) || w <= 0 || w > 500) return null;
    const mlMin = w * 30;
    const mlMax = w * 35;
    const litersMin = Math.round((mlMin / 1000) * 10) / 10;
    const litersMax = Math.round((mlMax / 1000) * 10) / 10;
    return { litersMin, litersMax, mlMin: Math.round(mlMin), mlMax: Math.round(mlMax) };
  }, [weight]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.litersMin}–${result.litersMax} L`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWeight("70");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Ingesta diaria recomendada" : "Recommended daily intake"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.litersMin}–{result.litersMax} L</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.mlMin}–${result.mlMax} ml` : `${result.mlMin}–${result.mlMax} ml`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un peso válido (1–500 kg)" : "Enter a valid weight (1–500 kg)"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
        <input
          type="number"
          min="1"
          max="500"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 70" : "e.g. 70"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Estimación basada en 30–35 ml por kg de peso corporal. Ajusta según actividad y clima."
          : "Estimate based on 30–35 ml per kg of body weight. Adjust for activity and climate."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "70 kg → 2.1–2.5 L (2100–2450 ml)" : "70 kg → 2.1–2.5 L (2100–2450 ml)"}</p>
        <p>{es ? "60 kg → 1.8–2.1 L (1800–2100 ml)" : "60 kg → 1.8–2.1 L (1800–2100 ml)"}</p>
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
