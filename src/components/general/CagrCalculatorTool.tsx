import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./CagrCalculatorTool.part1";
import { cagr, fieldClass, buttonClass } from "./CagrCalculatorTool.part2";

export function CagrCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [initial, setInitial] = useState("1000");
  const [final, setFinal] = useState("2000");
  const [years, setYears] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const i = parseFloat(initial);
    const f = parseFloat(final);
    const y = parseFloat(years);
    const r = cagr(i, f, y);
    if (typeof r === "object") {
      if (r.error === "initial") return { error: es ? "Valor inicial debe ser > 0" : "Initial value must be > 0" };
      if (r.error === "final") return { error: es ? "Valor final debe ser > 0" : "Final value must be > 0" };
      return { error: es ? "Años deben ser > 0" : "Years must be > 0" };
    }
    const pct = r * 100;
    const totalGrowth = ((f - i) / i) * 100;
    return { cagr: pct, totalGrowth, years: y };
  }, [initial, final, years, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.cagr.toFixed(2) + "%";
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInitial("1000");
    setFinal("2000");
    setYears("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.cagr.toFixed(2)}%</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `CAGR anual · crecimiento total ${result.totalGrowth.toFixed(1)}% en ${result.years} años`
                : `Annual CAGR · total growth ${result.totalGrowth.toFixed(1)}% over ${result.years} years`}
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
          <span className="font-medium">{es ? "Valor inicial" : "Initial value"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className={fieldClass}
            placeholder="1000"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor final" : "Final value"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={final}
            onChange={(e) => setFinal(e.target.value)}
            className={fieldClass}
            placeholder="2000"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Años" : "Years"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className={fieldClass}
            placeholder="5"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "CAGR = (valor final / valor inicial)^(1/años) − 1. Solo valores positivos."
          : "CAGR = (final / initial)^(1/years) − 1. Positive values only."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>1000 → 2000 en 5 años → 14.87%</p>
        <p>10000 → 15000 en 3 años → 14.47%</p>
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
