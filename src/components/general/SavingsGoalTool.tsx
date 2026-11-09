import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SavingsGoalTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [goal, setGoal] = useState("10000");
  const [current, setCurrent] = useState("2000");
  const [months, setMonths] = useState("12");
  const [rate, setRate] = useState("0");
  const [copied, setCopied] = useState(false);

  const g = parseFloat(goal) || 0;
  const c = parseFloat(current) || 0;
  const m = parseFloat(months) || 0;
  const r = parseFloat(rate) || 0;
  const remaining = Math.max(0, g - c);
  const valid = m > 0 && g >= 0 && c >= 0;

  let monthly = 0;
  if (valid && remaining > 0) {
    if (r === 0) {
      monthly = remaining / m;
    } else {
      const monthlyRate = r / 100 / 12;
      if (monthlyRate === 0) {
        monthly = remaining / m;
      } else {
        // PMT formula for future value of annuity
        monthly = (remaining * monthlyRate) / (Math.pow(1 + monthlyRate, m) - 1);
      }
    }
  }

  const result = valid
    ? es
      ? `Ahorro mensual necesario: ${monthly.toFixed(2)}`
      : `Monthly savings needed: ${monthly.toFixed(2)}`
    : es
      ? "Los meses deben ser mayores que 0"
      : "Months must be greater than 0";

  async function copy() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setGoal("10000");
    setCurrent("2000");
    setMonths("12");
    setRate("0");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Ahorro mensual" : "Monthly savings"}</p>
        <p className="text-3xl font-semibold">{valid ? monthly.toFixed(2) : "—"}</p>
        {valid && remaining > 0 && (
          <p className="text-sm text-muted-foreground">
            {es ? `Falta: ${remaining.toFixed(2)} en ${m} meses` : `Remaining: ${remaining.toFixed(2)} in ${m} months`}
          </p>
        )}
        {!valid && <p className="text-sm text-amber-600">{es ? "Los meses deben ser mayores que 0" : "Months must be greater than 0"}</p>}
        {valid && g < c && <p className="text-sm text-amber-600">{es ? "La meta ya fue alcanzada" : "Goal already reached"}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Meta de ahorro" : "Savings goal"}</span>
          <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} className={fieldClass} min="0" step="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ahorro actual" : "Current savings"}</span>
          <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className={fieldClass} min="0" step="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Meses" : "Months"}</span>
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className={fieldClass} min="1" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Interés anual % (opcional)" : "Annual interest % (optional)"}</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!valid}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: meta 10000, actual 2000, 12 meses, 0% → ~666.67/mes" : "Example 1: goal 10000, current 2000, 12 months, 0% → ~666.67/mo"}</p>
        <p>{es ? "Ejemplo 2: meta 5000, actual 0, 24 meses, 5% → menor que 208.33 por interés" : "Example 2: goal 5000, current 0, 24 months, 5% → less than 208.33 due to interest"}</p>
      </div>
    </div>
  );
}
