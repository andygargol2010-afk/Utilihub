import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MonthlyBudgetCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [income, setIncome] = useState("3000");
  const [fixed, setFixed] = useState("1200");
  const [variable, setVariable] = useState("800");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const i = parseFloat(income);
    const f = parseFloat(fixed);
    const v = parseFloat(variable);
    if (!Number.isFinite(i) || !Number.isFinite(f) || !Number.isFinite(v) || i <= 0 || f < 0 || v < 0 || Math.abs(i) > 1e12) return null;
    const totalExp = f + v;
    const remaining = i - totalExp;
    const usedPct = (totalExp / i) * 100;
    return {
      remaining: Math.round(remaining * 100) / 100,
      usedPct: Math.round(usedPct * 100) / 100,
      totalExp: Math.round(totalExp * 100) / 100,
    };
  }, [income, fixed, variable]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Restante: ${result.remaining} (${result.usedPct}% usado)`
      : `Remaining: ${result.remaining} (${result.usedPct}% used)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setIncome("3000");
    setFixed("1200");
    setVariable("800");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Presupuesto restante" : "Remaining budget"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.remaining}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Gastos totales: ${result.totalExp} · ${result.usedPct}% usado`
                : `Total expenses: ${result.totalExp} · ${result.usedPct}% used`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce ingresos > 0 y gastos ≥ 0" : "Enter income > 0 and expenses ≥ 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ingresos mensuales" : "Monthly income"}</span>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 3000" : "e.g. 3000"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Gastos fijos" : "Fixed expenses"}</span>
        <input
          type="number"
          value={fixed}
          onChange={(e) => setFixed(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1200" : "e.g. 1200"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Gastos variables" : "Variable expenses"}</span>
        <input
          type="number"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 800" : "e.g. 800"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula cuánto te queda del presupuesto mensual después de restar gastos fijos y variables."
          : "Calculate how much of your monthly budget remains after fixed and variable expenses."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Ingresos 3000, fijos 1200, variables 800 → restante 1000 (66.67% usado)" : "Income 3000, fixed 1200, variable 800 → remaining 1000 (66.67% used)"}</p>
        <p>{es ? "Ingresos 2000, fijos 1500, variables 200 → restante 300 (85% usado)" : "Income 2000, fixed 1500, variable 200 → remaining 300 (85% used)"}</p>
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
          <a href={es ? "/es/calculadora-gasto-diario" : "/calculadora-gasto-diario"} className="underline">
            {es ? "Calculadora de gasto diario" : "Daily spending calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-interes-compuesto" : "/calculadora-interes-compuesto"} className="underline">
            {es ? "Calculadora de interés compuesto" : "Compound interest calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
