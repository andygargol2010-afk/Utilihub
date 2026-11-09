import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function effectiveAnnualRate(nominalPercent: number, periodsPerYear: number): number | { error: string } {
  if (!Number.isFinite(nominalPercent) || nominalPercent < 0 || nominalPercent > 100) return { error: "nominal" };
  if (!Number.isFinite(periodsPerYear) || periodsPerYear < 1 || periodsPerYear > 365) return { error: "periods" };
  const r = nominalPercent / 100;
  const ear = Math.pow(1 + r / periodsPerYear, periodsPerYear) - 1;
  return ear * 100;
}

export function EffectiveAnnualRateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [nominal, setNominal] = useState("12");
  const [periods, setPeriods] = useState("12");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(nominal);
    const p = parseFloat(periods);
    const ear = effectiveAnnualRate(n, p);
    if (typeof ear === "object") {
      if (ear.error === "nominal") return { error: es ? "Tasa nominal debe estar entre 0 y 100 %" : "Nominal rate must be between 0 and 100%" };
      return { error: es ? "Períodos por año entre 1 y 365" : "Periods per year must be between 1 and 365" };
    }
    return { ear, nominal: n, periods: p };
  }, [nominal, periods, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.ear.toFixed(2) + " %";
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setNominal("12");
    setPeriods("12");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tasa efectiva anual (EAR)" : "Effective annual rate (EAR)"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.ear.toFixed(2)} %</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Para tasa nominal ${result.nominal}% capitalizada ${result.periods} veces al año`
                : `For nominal rate ${result.nominal}% compounded ${result.periods} times per year`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa valores" : "Enter values"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tasa nominal anual (%)" : "Nominal annual rate (%)"}</span>
          <input
            type="number"
            step="any"
            min="0"
            max="100"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className={fieldClass}
            placeholder="12"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Capitalizaciones por año" : "Compounding periods per year"}</span>
          <input
            type="number"
            step="1"
            min="1"
            max="365"
            value={periods}
            onChange={(e) => setPeriods(e.target.value)}
            className={fieldClass}
            placeholder="12"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "EAR = (1 + r/n)^n − 1, donde r es la tasa nominal y n el número de capitalizaciones."
          : "EAR = (1 + r/n)^n − 1, where r is the nominal rate and n the number of compounding periods."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>12 % nominal, 12 períodos → 12.68 %</p>
        <p>6 % nominal, 365 períodos → 6.18 %</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-interes-compuesto" : "/tools/calculadora-interes-compuesto"} className="underline text-primary">
            {es ? "Interés compuesto" : "Compound interest"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-interes-simple" : "/tools/calculadora-interes-simple"} className="underline text-primary">
            {es ? "Interés simple" : "Simple interest"}
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
