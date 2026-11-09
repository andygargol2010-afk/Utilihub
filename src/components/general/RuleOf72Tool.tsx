import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RuleOf72Tool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [rate, setRate] = useState("8");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(rate);
    if (isNaN(r) || r <= 0) return null;
    const years = 72 / r;
    return { years: Math.round(years * 10) / 10, rate: r };
  }, [rate]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `A ${result.rate}% se duplica en ~${result.years} años (Regla del 72)`
      : `At ${result.rate}% doubles in ~${result.years} years (Rule of 72)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRate("8");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tiempo para duplicar" : "Time to double"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.years} {es ? "años" : "years"}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `A una tasa del ${result.rate}% anual`
                : `At ${result.rate}% annual rate`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Tasa inválida" : "Invalid rate"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tasa de interés anual (%)" : "Annual interest rate (%)"}</span>
        <input type="number" min="0.1" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "8% → ~9 años" : "8% → ~9 years"}</p>
        <p>{es ? "6% → ~12 años" : "6% → ~12 years"}</p>
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
