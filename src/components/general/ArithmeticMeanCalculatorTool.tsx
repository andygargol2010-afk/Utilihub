import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ArithmeticMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("10, 20, 30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const parts = input.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
    const nums = parts.map(parseFloat).filter((n) => !isNaN(n));
    if (nums.length === 0) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    return { mean: Math.round(mean * 100) / 100, count: nums.length, sum };
  }, [input]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Media aritmética: ${result.mean} (${result.count} números)`
      : `Arithmetic mean: ${result.mean} (${result.count} numbers)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput("10, 20, 30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media aritmética" : "Arithmetic mean"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.mean}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce números" : "Enter numbers"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Números (separados por coma o espacio)" : "Numbers (comma or space separated)"}</span>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} placeholder={es ? "ej. 5 10 15 o 5,10,15" : "e.g. 5 10 15 or 5,10,15"} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10, 20, 30 → 20" : "10, 20, 30 → 20"}</p>
        <p>{es ? "1 2 3 4 5 → 3" : "1 2 3 4 5 → 3"}</p>
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
