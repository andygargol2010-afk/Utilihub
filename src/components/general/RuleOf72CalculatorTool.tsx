import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RuleOf72CalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [rate, setRate] = useState("8");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(rate);
    if (!Number.isFinite(r) || r <= 0) return null;
    const ruleYears = 72 / r;
    const exactYears = Math.log(2) / Math.log(1 + r / 100);
    return {
      rule: Math.round(ruleYears * 100) / 100,
      exact: Math.round(exactYears * 100) / 100,
    };
  }, [rate]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Tasa ${rate}% → Regla del 72: ≈ ${result.rule} años (exacto ≈ ${result.exact})`
      : `Rate ${rate}% → Rule of 72: ≈ ${result.rule} years (exact ≈ ${result.exact})`;
    try {
      await navigator.clipboard.writeText(text);
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
        <p className="text-sm text-muted-foreground">{es ? "Años para duplicar (Regla del 72)" : "Years to double (Rule of 72)"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold font-mono">≈ {result.rule} {es ? "años" : "years"}</p>
            <p className="text-sm text-muted-foreground">{es ? `Exacto (compuesto anual): ≈ ${result.exact} años` : `Exact (annual compound): ≈ ${result.exact} years`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá una tasa anual positiva" : "Enter a positive annual rate"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tasa anual (%)" : "Annual rate (%)"}</span>
        <input
          type="number"
          step="any"
          min="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "8% → ≈ 9 años (exacto ≈ 9.01)" : "8% → ≈ 9 years (exact ≈ 9.01)"}</p>
        <p>{es ? "6% → ≈ 12 años (exacto ≈ 11.90)" : "6% → ≈ 12 years (exact ≈ 11.90)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: calculadora-interes-compuesto, calculadora-cagr" : "Related: calculadora-interes-compuesto, calculadora-cagr"}
      </p>
    </div>
  );
}
