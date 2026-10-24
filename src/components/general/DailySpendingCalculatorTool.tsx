import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DailySpendingCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [monthly, setMonthly] = useState("3000");
  const [days, setDays] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(monthly);
    const d = parseFloat(days);
    if (isNaN(m) || m < 0 || m > 1000000 || isNaN(d) || d <= 0 || d > 366) return null;
    const daily = m / d;
    return {
      daily: Math.round(daily * 100) / 100,
      weekly: Math.round(daily * 7 * 100) / 100,
    };
  }, [monthly, days]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.daily}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMonthly("3000");
    setDays("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Gasto diario" : "Daily spending"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.daily}</p>
            <p className="text-sm text-muted-foreground">{es ? `Semanal ≈ ${result.weekly}` : `Weekly ≈ ${result.weekly}`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce monto ≥ 0 y días > 0" : "Enter amount ≥ 0 and days > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Monto mensual" : "Monthly amount"}</span>
        <input
          type="number"
          step="any"
          min="0"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Días" : "Days"}</span>
        <input
          type="number"
          step="1"
          min="1"
          max="366"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Divide el presupuesto mensual entre los días del período." : "Divide monthly budget by the number of days."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "3000 / 30 días → 100 al día" : "3000 / 30 days → 100 per day"}</p>
        <p>{es ? "1500 / 31 días → ≈48.39 al día" : "1500 / 31 days → ≈48.39 per day"}</p>
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
