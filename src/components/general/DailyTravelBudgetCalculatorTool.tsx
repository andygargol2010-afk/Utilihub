import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DailyTravelBudgetCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [total, setTotal] = useState("1000");
  const [days, setDays] = useState("7");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const t = parseFloat(total);
    const d = parseFloat(days);
    if (!Number.isFinite(t) || t < 0 || t > 1000000 || !Number.isFinite(d) || d <= 0 || d > 365) return null;
    const daily = Math.round((t / d) * 100) / 100;
    return { daily };
  }, [total, days]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Presupuesto diario: ${result.daily}`
      : `Daily budget: ${result.daily}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTotal("1000");
    setDays("7");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Presupuesto diario" : "Daily budget"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.daily}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce valores válidos" : "Enter valid values"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Presupuesto total" : "Total budget"}</span>
        <input
          type="number"
          min="0"
          max="1000000"
          step="1"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1000" : "e.g. 1000"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número de días" : "Number of days"}</span>
        <input
          type="number"
          min="1"
          max="365"
          step="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 7" : "e.g. 7"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Divide tu presupuesto total de viaje entre los días para obtener el gasto diario recomendado."
          : "Divides your total travel budget by the number of days to get the recommended daily spending."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1000 en 7 días → 142.86 por día" : "1000 over 7 days → 142.86 per day"}</p>
        <p>{es ? "2000 en 10 días → 200.00 por día" : "2000 over 10 days → 200.00 per day"}</p>
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
