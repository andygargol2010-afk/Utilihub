import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function StudyHoursCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [goal, setGoal] = useState("100");
  const [days, setDays] = useState("20");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const g = parseFloat(goal);
    const d = parseFloat(days);
    if (isNaN(g) || isNaN(d) || g < 0 || g > 10000 || d <= 0 || d > 365) return null;
    const daily = g / d;
    return { daily: Math.round(daily * 10) / 10 };
  }, [goal, days]);

  async function copy() {
    if (!result) return;
    const text = `${result.daily}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setGoal("100"); setDays("20"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Horas diarias necesarias" : "Daily hours needed"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.daily} {es ? "horas/día" : "hours/day"}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos: meta ≥0, días >0 y ≤365" : "Valid values: goal ≥0, days >0 and ≤365"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Horas totales meta" : "Total goal hours"}</span>
        <input type="number" step="1" min="0" value={goal} onChange={(e) => setGoal(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Días disponibles" : "Days available"}</span>
        <input type="number" step="1" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: horas diarias = horas totales / días disponibles." : "Formula: daily hours = total hours / days available."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 horas en 20 días → 5 horas/día" : "100 hours in 20 days → 5 hours/day"}</p>
        <p>{es ? "50 horas en 10 días → 5 horas/día" : "50 hours in 10 days → 5 hours/day"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar horas diarias" : "Copy daily hours"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
