import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DailyInterestCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [days, setDays] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const d = parseFloat(days);
    if (isNaN(p) || p <= 0 || p > 1e12 || isNaN(r) || r < 0 || r > 100 || isNaN(d) || d <= 0 || d > 36500) return null;
    const dailyRate = r / 100 / 365;
    const interest = p * dailyRate * d;
    return Math.round(interest * 100) / 100;
  }, [principal, rate, days]);

  async function copy() {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(`${result}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrincipal("10000");
    setRate("5");
    setDays("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Interés diario" : "Daily interest"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Principal > 0, tasa ≥ 0, días > 0" : "Principal > 0, rate ≥ 0, days > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Principal" : "Principal"}</span>
        <input
          type="number"
          step="any"
          min="0.01"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tasa anual (%)" : "Annual rate (%)"}</span>
        <input
          type="number"
          step="any"
          min="0"
          max="100"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Días" : "Days"}</span>
        <input
          type="number"
          step="1"
          min="1"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Interés simple diario = principal × (tasa/100/365) × días." : "Simple daily interest = principal × (rate/100/365) × days."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10000 al 5% por 30 días → ≈41.10" : "10000 at 5% for 30 days → ≈41.10"}</p>
        <p>{es ? "5000 al 3.5% por 365 días → 175" : "5000 at 3.5% for 365 days → 175"}</p>
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
