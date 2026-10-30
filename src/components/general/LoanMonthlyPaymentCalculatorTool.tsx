import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LoanMonthlyPaymentCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("5");
  const [years, setYears] = useState("3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const rate = parseFloat(annualRate);
    const y = parseFloat(years);
    if (
      !Number.isFinite(p) || p <= 0 || p > 10000000 ||
      !Number.isFinite(rate) || rate < 0 || rate > 50 ||
      !Number.isFinite(y) || y <= 0 || y > 50
    ) return null;
    const r = rate / 100 / 12;
    const n = y * 12;
    if (r === 0) {
      const monthly = Math.round((p / n) * 100) / 100;
      return { monthly, total: Math.round(p * 100) / 100, interest: 0 };
    }
    const monthly = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) * 100) / 100;
    const total = Math.round(monthly * n * 100) / 100;
    const interest = Math.round((total - p) * 100) / 100;
    return { monthly, total, interest };
  }, [principal, annualRate, years]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Cuota mensual: ${result.monthly} | Total: ${result.total} | Interés: ${result.interest}`
      : `Monthly payment: ${result.monthly} | Total: ${result.total} | Interest: ${result.interest}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrincipal("10000");
    setAnnualRate("5");
    setYears("3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Cuota mensual del préstamo" : "Monthly loan payment"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{es ? `Cuota: ${result.monthly}` : `Payment: ${result.monthly}`}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Total a pagar: ${result.total} · Interés total: ${result.interest}`
                : `Total paid: ${result.total} · Total interest: ${result.interest}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce capital, tasa y años válidos" : "Enter a valid principal, rate and years"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Capital del préstamo" : "Loan principal"}</span>
        <input
          type="number"
          min="1"
          max="10000000"
          step="100"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 10000" : "e.g. 10000"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tasa de interés anual (%)" : "Annual interest rate (%)"}</span>
        <input
          type="number"
          min="0"
          max="50"
          step="0.1"
          value={annualRate}
          onChange={(e) => setAnnualRate(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 5" : "e.g. 5"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Plazo en años" : "Term in years"}</span>
        <input
          type="number"
          min="0.5"
          max="50"
          step="0.5"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 3" : "e.g. 3"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la cuota mensual fija (principal + interés) de un préstamo. No incluye impuestos ni seguros."
          : "Calculates the fixed monthly payment (principal + interest) of a loan. Taxes and insurance not included."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 000 al 5% a 3 años → Cuota ≈ 299.71" : "10,000 at 5% for 3 years → Payment ≈ 299.71"}</p>
        <p>{es ? "200 000 al 4.5% a 30 años → Cuota ≈ 1 013.37" : "200,000 at 4.5% for 30 years → Payment ≈ 1,013.37"}</p>
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
