import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LogarithmCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [number, setNumber] = useState("100");
  const [base, setBase] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(number);
    const b = parseFloat(base);
    if (isNaN(n) || n <= 0 || isNaN(b) || b <= 0 || b === 1 || n > 1e15 || b > 1e6) return null;
    const log = Math.log(n) / Math.log(b);
    return Math.round(log * 10000) / 10000;
  }, [number, base]);

  async function copy() {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(`${result}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setNumber("100");
    setBase("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Número > 0, base > 0 y ≠ 1" : "Number > 0, base > 0 and ≠ 1"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número" : "Number"}</span>
        <input
          type="number"
          step="any"
          min="0.0001"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Base" : "Base"}</span>
        <input
          type="number"
          step="any"
          min="0.0001"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula log_b(n) = ln(n)/ln(b)." : "Calculates log_b(n) = ln(n)/ln(b)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 base 10 → 2" : "100 base 10 → 2"}</p>
        <p>{es ? "8 base 2 → 3" : "8 base 2 → 3"}</p>
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
