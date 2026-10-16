import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function Budget503020Tool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [income, setIncome] = useState("4000");
  const [copied, setCopied] = useState(false);

  const num = useMemo(() => parseFloat(income) || 0, [income]);
  const needs = useMemo(() => (num * 0.5).toFixed(2), [num]);
  const wants = useMemo(() => (num * 0.3).toFixed(2), [num]);
  const savings = useMemo(() => (num * 0.2).toFixed(2), [num]);

  async function copy() {
    const textOut = es
      ? `Ingreso: ${num}\nNecesidades (50%): ${needs}\nDeseos (30%): ${wants}\nAhorros (20%): ${savings}`
      : `Income: ${num}\nNeeds (50%): ${needs}\nWants (30%): ${wants}\nSavings (20%): ${savings}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setIncome("4000");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{es ? "Distribución mensual" : "Monthly split"}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">{es ? "Necesidades 50%" : "Needs 50%"}</p>
            <p className="text-2xl font-semibold">{needs}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{es ? "Deseos 30%" : "Wants 30%"}</p>
            <p className="text-2xl font-semibold">{wants}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{es ? "Ahorros 20%" : "Savings 20%"}</p>
            <p className="text-2xl font-semibold">{savings}</p>
          </div>
        </div>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ingreso mensual (después de impuestos)" : "Monthly after-tax income"}</span>
        <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className={fieldClass} min="0" step="1" />
      </label>

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
