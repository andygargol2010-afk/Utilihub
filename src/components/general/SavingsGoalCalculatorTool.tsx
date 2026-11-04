import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./SavingsGoalCalculatorTool.part1";
import { buttonClass, fieldClass } from "./SavingsGoalCalculatorTool.part2";

export function SavingsGoalCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [goal, setGoal] = useState("5000");
  const [months, setMonths] = useState("12");
  const [monthly, setMonthly] = useState("");
  const [mode, setMode] = useState<"months" | "monthly">("months");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const g = parseFloat(goal);
    if (!Number.isFinite(g) || g <= 0 || g > 10000000) return null;

    if (mode === "months") {
      const m = parseFloat(months);
      if (!Number.isFinite(m) || m <= 0 || m > 600) return null;
      const monthlyNeeded = Math.round((g / m) * 100) / 100;
      return { monthlyNeeded, months: m, goal: g };
    } else {
      const mon = parseFloat(monthly);
      if (!Number.isFinite(mon) || mon <= 0 || mon > 100000) return null;
      const monthsNeeded = Math.ceil(g / mon);
      return { monthsNeeded, monthly: mon, goal: g };
    }
  }, [goal, months, monthly, mode]);

  async function copy() {
    if (!result) return;
    const text = es
      ? mode === "months"
        ? `Ahorro mensual necesario: ${result.monthlyNeeded} para meta de ${result.goal} en ${result.months} meses`
        : `Meses necesarios: ${result.monthsNeeded} para meta de ${result.goal} ahorrando ${result.monthly}/mes`
      : mode === "months"
        ? `Monthly savings needed: ${result.monthlyNeeded} for goal of ${result.goal} in ${result.months} months`
        : `Months needed: ${result.monthsNeeded} for goal of ${result.goal} saving ${result.monthly}/month`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setGoal("5000");
    setMonths("12");
    setMonthly("");
    setMode("months");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calculadora de ahorro para una meta" : "Savings goal calculator"}</p>
        {result ? (
          <div className="space-y-1">
            {mode === "months" ? (
              <p className="text-3xl font-semibold">{es ? `${result.monthlyNeeded} / mes` : `${result.monthlyNeeded} / month`}</p>
            ) : (
              <p className="text-3xl font-semibold">{es ? `${result.monthsNeeded} meses` : `${result.monthsNeeded} months`}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce valores válidos (meta > 0)" : "Enter valid values (goal > 0)"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${mode === "months" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("months")}>
          {es ? "Por meses" : "By months"}
        </button>
        <button type="button" className={`${buttonClass} ${mode === "monthly" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("monthly")}>
          {es ? "Por ahorro mensual" : "By monthly savings"}
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Meta de ahorro" : "Savings goal"}</span>
        <input
          type="number"
          min="1"
          max="10000000"
          step="1"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 5000" : "e.g. 5000"}
        />
      </label>

      {mode === "months" ? (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Meses" : "Months"}</span>
          <input
            type="number"
            min="1"
            max="600"
            step="1"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className={fieldClass}
            placeholder={es ? "Ej. 12" : "e.g. 12"}
          />
        </label>
      ) : (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ahorro mensual" : "Monthly savings"}</span>
          <input
            type="number"
            min="1"
            max="100000"
            step="1"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className={fieldClass}
            placeholder={es ? "Ej. 400" : "e.g. 400"}
          />
        </label>
      )}

      <p className="text-sm text-muted-foreground">
        {es
          ? "Divide la meta entre los meses para saber cuánto ahorrar cada mes. O divide la meta entre tu ahorro mensual para saber en cuántos meses llegarás. Sin intereses para simplicidad."
          : "Divide the goal by months to get the required monthly savings. Or divide the goal by your monthly amount to get the months needed. No interest assumed for simplicity."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Meta 5000 en 12 meses → 416.67 / mes" : "Goal 5000 in 12 months → 416.67 / month"}</p>
        <p>{es ? "Meta 10000 ahorrando 400/mes → 25 meses" : "Goal 10000 saving 400/month → 25 months"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-tasa-de-ahorro" : "/tools/calculadora-tasa-de-ahorro"} className="underline text-primary">
            {es ? "Tasa de ahorro" : "Savings rate"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-interes-compuesto" : "/tools/calculadora-interes-compuesto"} className="underline text-primary">
            {es ? "Interés compuesto" : "Compound interest"}
          </a>
        </p>
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
