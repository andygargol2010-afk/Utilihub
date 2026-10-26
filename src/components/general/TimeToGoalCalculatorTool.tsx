import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TimeToGoalCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [goal, setGoal] = useState("1000");
  const [rate, setRate] = useState("50");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const g = parseFloat(goal);
    const r = parseFloat(rate);
    if (!Number.isFinite(g) || !Number.isFinite(r) || r <= 0 || g < 0 || Math.abs(g) > 1e9 || Math.abs(r) > 1e6) return null;
    const hours = g / r;
    return { hours: Math.round(hours * 100) / 100, days: Math.round((hours / 8) * 100) / 100 };
  }, [goal, rate]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Horas necesarias: ${result.hours} | Días (8h): ${result.days}`
      : `Hours needed: ${result.hours} | Days (8h): ${result.days}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setGoal("1000");
    setRate("50");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo para la meta" : "Time to goal"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.hours} {es ? "horas" : "hours"}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `≈ ${result.days} días de 8 horas` : `≈ ${result.days} 8-hour days`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce meta y tasa válidas (tasa > 0)" : "Enter valid goal and rate (rate > 0)"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Meta (unidades)" : "Goal (units)"}</span>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1000" : "e.g. 1000"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tasa por hora" : "Rate per hour"}</span>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 50" : "e.g. 50"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula cuántas horas necesitas para alcanzar una meta a una tasa constante."
          : "Calculates how many hours you need to reach a goal at a constant rate."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1000 unidades a 50/h → 20 horas" : "1000 units at 50/h → 20 hours"}</p>
        <p>{es ? "200 páginas a 10/h → 20 horas" : "200 pages at 10/h → 20 hours"}</p>
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
