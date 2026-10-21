import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageChangeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [oldVal, setOldVal] = useState("100");
  const [newVal, setNewVal] = useState("120");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const o = parseFloat(oldVal);
    const n = parseFloat(newVal);
    if (isNaN(o) || isNaN(n) || o === 0) return null;
    const change = ((n - o) / o) * 100;
    return { change: Math.round(change * 100) / 100, old: o, new: n };
  }, [oldVal, newVal]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Cambio: ${result.change}% (de ${result.old} a ${result.new})`
      : `Change: ${result.change}% (from ${result.old} to ${result.new})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setOldVal("100");
    setNewVal("120");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Cambio porcentual" : "Percentage change"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.change}%</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valor inicial ≠ 0" : "Initial value ≠ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor inicial" : "Initial value"}</span>
          <input type="number" step="any" value={oldVal} onChange={(e) => setOldVal(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor final" : "Final value"}</span>
          <input type="number" step="any" value={newVal} onChange={(e) => setNewVal(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 → 120 = 20%" : "100 → 120 = 20%"}</p>
        <p>{es ? "50 → 40 = -20%" : "50 → 40 = -20%"}</p>
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
