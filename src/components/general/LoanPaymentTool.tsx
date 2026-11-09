import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LoanPaymentTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [months, setMonths] = useState("36");
  const [copied, setCopied] = useState(false);

  const P = parseFloat(principal) || 0;
  const annualRate = parseFloat(rate) || 0;
  const n = parseFloat(months) || 0;
  const r = annualRate / 100 / 12;

  let monthly = 0;
  let totalInterest = 0;
  let totalAmount = 0;

  if (P > 0 && n > 0) {
    if (r === 0) {
      monthly = P / n;
    } else {
      const factor = Math.pow(1 + r, n);
      monthly = (P * r * factor) / (factor - 1);
    }
    totalAmount = monthly * n;
    totalInterest = totalAmount - P;
  }

  const result = es
    ? `Cuota mensual: $${monthly.toFixed(2)} | Intereses totales: $${totalInterest.toFixed(2)} | Total a pagar: $${totalAmount.toFixed(2)}`
    : `Monthly payment: $${monthly.toFixed(2)} | Total interest: $${totalInterest.toFixed(2)} | Total amount: $${totalAmount.toFixed(2)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setPrincipal("10000");
    setRate("5");
    setMonths("36");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Cuota mensual" : "Monthly payment"}</p>
        <p className="text-3xl font-semibold">${monthly.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground">
          {es
            ? `Intereses: $${totalInterest.toFixed(2)} · Total: $${totalAmount.toFixed(2)}`
            : `Interest: $${totalInterest.toFixed(2)} · Total: $${totalAmount.toFixed(2)}`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Capital ($)" : "Principal ($)"}</span>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={fieldClass} min="0" step="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tasa anual (%)" : "Annual rate (%)"}</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Plazo (meses)" : "Term (months)"}</span>
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className={fieldClass} min="1" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: $10.000, 5%, 36 meses → ~$299.71/mes" : "Example 1: $10,000, 5%, 36 months → ~$299.71/mo"}</p>
        <p>{es ? "Ejemplo 2: $50.000, 7.5%, 60 meses → ~$1.001.89/mes" : "Example 2: $50,000, 7.5%, 60 months → ~$1,001.89/mo"}</p>
      </div>
    </div>
  );
}
