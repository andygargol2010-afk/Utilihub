import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageOfNumberCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [percentage, setPercentage] = useState("15");
  const [number, setNumber] = useState("200");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(percentage);
    const n = parseFloat(number);
    if (isNaN(p) || isNaN(n) || p < 0 || p > 1000 || n < 0 || n > 1e12) return null;
    const value = (p / 100) * n;
    return { value: Math.round(value * 100) / 100 };
  }, [percentage, number]);

  async function copy() {
    if (!result) return;
    const text = `${result.value}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setPercentage("15"); setNumber("200"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado: X% de Y" : "Result: X% of Y"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.value}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (porcentaje 0-1000, número ≥0)" : "Valid values required (percentage 0-1000, number ≥0)"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porcentaje (%)" : "Percentage (%)"}</span>
        <input type="number" step="0.1" min="0" max="1000" value={percentage} onChange={(e) => setPercentage(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número" : "Number"}</span>
        <input type="number" step="0.01" min="0" value={number} onChange={(e) => setNumber(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: (porcentaje / 100) × número. Ideal para descuentos, propinas o impuestos." : "Formula: (percentage / 100) × number. Ideal for discounts, tips or taxes."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "15% de 200 → 30" : "15% of 200 → 30"}</p>
        <p>{es ? "25% de 80 → 20" : "25% of 80 → 20"}</p>
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
