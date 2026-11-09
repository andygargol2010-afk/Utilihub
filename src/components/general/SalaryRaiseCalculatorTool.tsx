import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SalaryRaiseCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [current, setCurrent] = useState("50000");
  const [percent, setPercent] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(current);
    const p = parseFloat(percent);
    if (isNaN(c) || c < 0 || c > 1e9 || isNaN(p) || p < -100 || p > 1000) return null;
    const increase = c * (p / 100);
    const next = c + increase;
    return { increase: increase.toFixed(2), next: next.toFixed(2) };
  }, [current, percent]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${es ? "Nuevo salario" : "New salary"}: ${result.next}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCurrent("50000");
    setPercent("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Nuevo salario" : "New salary"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.next}</p>
            <p className="text-sm text-muted-foreground">{es ? "Aumento" : "Increase"}: {result.increase}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Salario ≥ 0 y porcentaje válido" : "Salary ≥ 0 and valid percent required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Salario actual" : "Current salary"}</span>
        <input type="number" step="any" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Aumento (%)" : "Raise (%)"}</span>
        <input type="number" step="any" value={percent} onChange={(e) => setPercent(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: Nuevo = Actual × (1 + %/100)" : "Formula: New = Current × (1 + %/100)"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "50 000 + 5 % → 52 500" : "50,000 + 5% → 52,500"}</p>
        <p>{es ? "30 000 + 10 % → 33 000" : "30,000 + 10% → 33,000"}</p>
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
