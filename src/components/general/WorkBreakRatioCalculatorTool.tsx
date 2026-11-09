import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WorkBreakRatioCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [workHours, setWorkHours] = useState("8");
  const [ratio, setRatio] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(workHours);
    const r = parseFloat(ratio);
    if (isNaN(w) || w <= 0 || w > 24 || isNaN(r) || r <= 0 || r > 20) return null;
    const breakHours = w / r;
    const total = w + breakHours;
    return {
      breakH: Math.round(breakHours * 100) / 100,
      breakMin: Math.round(breakHours * 60),
      totalH: Math.round(total * 100) / 100,
    };
  }, [workHours, ratio]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.breakMin} min`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWorkHours("8");
    setRatio("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo de descanso recomendado" : "Recommended break time"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.breakMin} min</p>
            <p className="text-sm text-muted-foreground">({result.breakH} h) · Total: {result.totalH} h</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce horas de trabajo > 0" : "Enter work hours > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Horas de trabajo" : "Work hours"}</span>
        <input
          type="number"
          step="any"
          min="0.5"
          max="24"
          value={workHours}
          onChange={(e) => setWorkHours(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ratio trabajo:descanso (ej. 5 = 5:1)" : "Work:break ratio (e.g. 5 = 5:1)"}</span>
        <input
          type="number"
          step="any"
          min="1"
          max="20"
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Ratio común 5:1 (estilo Pomodoro) o 4:1. Calcula descansos totales."
          : "Common ratio 5:1 (Pomodoro-style) or 4:1. Calculates total breaks for the work period."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "8 h trabajo, ratio 5 → 96 min descanso" : "8 h work, ratio 5 → 96 min break"}</p>
        <p>{es ? "6 h trabajo, ratio 4 → 90 min descanso" : "6 h work, ratio 4 → 90 min break"}</p>
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
