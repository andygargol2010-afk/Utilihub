import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SimpleInterestCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) return null;
    const interest = p * (r / 100) * t;
    const total = p + interest;
    return {
      interest: Math.round(interest * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, [principal, rate, time]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Inter\u00e9s: ${result.interest} | Total: ${result.total}`
      : `Interest: ${result.interest} | Total: ${result.total}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrincipal("1000");
    setRate("5");
    setTime("2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Inter\u00e9s simple" : "Simple interest"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.interest}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Total: ${result.total}` : `Total: ${result.total}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce principal > 0, tasa \u2265 0 y tiempo > 0" : "Enter principal > 0, rate \u2265 0 and time > 0"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Principal" : "Principal"}</span>
          <input type="number" step="any" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tasa anual (%)" : "Annual rate (%)"}</span>
          <input type="number" step="any" min="0" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tiempo (a\u00f1os)" : "Time (years)"}</span>
          <input type="number" step="any" min="0" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1000 al 5% durante 2 a\u00f1os \u2192 inter\u00e9s 100, total 1100" : "1000 at 5% for 2 years \u2192 interest 100, total 1100"}</p>
        <p>{es ? "500 al 10% durante 1 a\u00f1o \u2192 inter\u00e9s 50, total 550" : "500 at 10% for 1 year \u2192 interest 50, total 550"}</p>
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
