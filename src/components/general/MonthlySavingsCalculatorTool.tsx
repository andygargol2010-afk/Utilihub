import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MonthlySavingsCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [goal, setGoal] = useState("10000");
  const [current, setCurrent] = useState("2000");
  const [months, setMonths] = useState("12");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const g = parseFloat(goal);
    const c = parseFloat(current);
    const m = parseFloat(months);
    if (isNaN(g) || isNaN(c) || isNaN(m) || m <= 0 || g < c) return null;
    if (Math.abs(g) > 1e12 || Math.abs(c) > 1e12 || m > 1200) return null;
    const monthly = (g - c) / m;
    return { monthly: Number.isFinite(monthly) ? monthly.toFixed(2) : null };
  }, [goal, current, months]);

  async function copy() {
    if (!result?.monthly) return;
    try {
      await navigator.clipboard.writeText(result.monthly);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setGoal("10000");
    setCurrent("2000");
    setMonths("12");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Ahorro mensual" : "Monthly savings"}</p>
        {result?.monthly != null ? (
          <p className="text-3xl font-semibold">{result.monthly}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (meses > 0, meta ≥ actual)" : "Valid values required (months > 0, goal ≥ current)"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Meta" : "Goal"}</span>
          <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ahorro actual" : "Current savings"}</span>
          <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Meses" : "Months"}</span>
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Ahorro mensual = (Meta - Actual) / Meses" : "Monthly = (Goal - Current) / Months"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Meta 10000, actual 2000, 12 meses → 666.67" : "Goal 10000, current 2000, 12 months → 666.67"}</p>
        <p>{es ? "Meta 5000, actual 0, 10 meses → 500.00" : "Goal 5000, current 0, 10 months → 500.00"}</p>
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
