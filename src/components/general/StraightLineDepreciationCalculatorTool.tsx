import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./StraightLineDepreciationCalculatorTool.part1";
import { fieldClass, buttonClass } from "./StraightLineDepreciationCalculatorTool.part2";

export function StraightLineDepreciationCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [cost, setCost] = useState("10000");
  const [salvage, setSalvage] = useState("2000");
  const [years, setYears] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(cost);
    const s = parseFloat(salvage);
    const y = parseFloat(years);
    if (Number.isNaN(c) || Number.isNaN(s) || Number.isNaN(y) || !Number.isFinite(c) || !Number.isFinite(s) || !Number.isFinite(y)) return null;
    if (c < 0 || s < 0 || y <= 0) return { error: es ? "Costo y residual ≥ 0; años > 0" : "Cost and salvage ≥ 0; years > 0" };
    if (s > c) return { error: es ? "El residual no puede superar el costo" : "Salvage cannot exceed cost" };
    if (y > 100) return { error: es ? "Vida útil fuera de rango razonable" : "Useful life outside reasonable range" };
    const annual = (c - s) / y;
    return { annual, c, s, y };
  }, [cost, salvage, years, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Depreciación anual: ${result.annual.toFixed(2)}`
      : `Annual depreciation: ${result.annual.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCost("10000");
    setSalvage("2000");
    setYears("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Depreciación anual" : "Annual depreciation"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.annual.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              ({result.c} − {result.s}) / {result.y} años
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Costo" : "Cost"}</span>
          <input type="number" min="0" step="any" value={cost} onChange={(e) => setCost(e.target.value)} className={fieldClass} placeholder="10000" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor residual" : "Salvage value"}</span>
          <input type="number" min="0" step="any" value={salvage} onChange={(e) => setSalvage(e.target.value)} className={fieldClass} placeholder="2000" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Años de vida útil" : "Useful life (years)"}</span>
          <input type="number" min="1" step="1" value={years} onChange={(e) => setYears(e.target.value)} className={fieldClass} placeholder="5" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Depreciación lineal: el mismo importe cada año. Fórmula: (Costo − Residual) ÷ Años."
          : "Straight-line: equal amount each year. Formula: (Cost − Salvage) ÷ Years."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Costo 10 000, residual 2 000, 5 años → 1 600 / año" : "Cost 10,000, salvage 2,000, 5 years → 1,600 / year"}</p>
        <p>{es ? "Costo 5 000, residual 0, 10 años → 500 / año" : "Cost 5,000, salvage 0, 10 years → 500 / year"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-interes-simple" : "/tools/calculadora-interes-simple"} className="underline text-primary">
            {es ? "Calculadora de interés simple" : "Simple interest calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-markup" : "/tools/calculadora-markup"} className="underline text-primary">
            {es ? "Calculadora de markup" : "Markup calculator"}
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
