import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SavingsRateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [income, setIncome] = useState("5000");
  const [expenses, setExpenses] = useState("3500");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const inc = parseFloat(income);
    const exp = parseFloat(expenses);
    if (isNaN(inc) || isNaN(exp) || inc <= 0 || exp < 0 || exp > 100000000) return null;
    const saved = inc - exp;
    const rate = (saved / inc) * 100;
    return {
      saved: Math.round(saved * 100) / 100,
      rate: Math.round(rate * 100) / 100,
    };
  }, [income, expenses]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Tasa de ahorro: ${result.rate}% (ahorrado: ${result.saved})`
      : `Savings rate: ${result.rate}% (saved: ${result.saved})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setIncome("5000");
    setExpenses("3500");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tasa de ahorro" : "Savings rate"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.rate}%</p>
            <p className="text-sm">{es ? `Monto ahorrado: ${result.saved}` : `Amount saved: ${result.saved}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresos > 0 y gastos ≥ 0" : "Income > 0 and expenses ≥ 0"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ingresos mensuales" : "Monthly income"}</span>
          <input type="number" step="any" min="0.01" value={income} onChange={(e) => setIncome(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Gastos mensuales" : "Monthly expenses"}</span>
          <input type="number" step="any" min="0" value={expenses} onChange={(e) => setExpenses(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: tasa = ((ingresos − gastos) / ingresos) × 100. Útil para finanzas personales." : "Formula: rate = ((income − expenses) / income) × 100. Useful for personal finance."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Ingresos 5000, gastos 3500 → 30% (ahorrado 1500)" : "Income 5000, expenses 3500 → 30% (saved 1500)"}</p>
        <p>{es ? "Ingresos 3000, gastos 2700 → 10% (ahorrado 300)" : "Income 3000, expenses 2700 → 10% (saved 300)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-precio-por-unidad" : "/calculadora-precio-por-unidad"} className="underline">
            {es ? "Calculadora de precio por unidad" : "Unit price calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-markup" : "/calculadora-markup"} className="underline">
            {es ? "Calculadora de markup" : "Markup calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
