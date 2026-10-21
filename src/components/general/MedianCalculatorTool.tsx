import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MedianCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("1, 3, 5, 7, 9");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const parts = input.split(/[,\s]+/).map((p) => p.trim()).filter(Boolean);
    const nums = parts.map(parseFloat).filter((n) => !isNaN(n)).sort((a, b) => a - b);
    if (nums.length === 0) return null;
    const mid = Math.floor(nums.length / 2);
    const median = nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
    return { median: Math.round(median * 100) / 100, count: nums.length, sorted: nums };
  }, [input]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Mediana: ${result.median} (${result.count} números)`
      : `Median: ${result.median} (${result.count} numbers)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput("1, 3, 5, 7, 9");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Mediana" : "Median"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.median}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce números" : "Enter numbers"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Números (separados por coma o espacio)" : "Numbers (comma or space separated)"}</span>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} placeholder={es ? "ej. 1 2 3 4 o 1,2,3,4" : "e.g. 1 2 3 4 or 1,2,3,4"} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 3, 5, 7, 9 → 5" : "1, 3, 5, 7, 9 → 5"}</p>
        <p>{es ? "1 2 3 4 → 2.5" : "1 2 3 4 → 2.5"}</p>
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
