import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SquareRootCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("144");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (isNaN(n) || n < 0 || n > 1e15) return null;
    const root = Math.sqrt(n);
    return { root: Math.round(root * 1e8) / 1e8 };
  }, [value]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.root}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("144");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Raíz cuadrada" : "Square root"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.root}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un número ≥ 0" : "Enter a number ≥ 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número" : "Number"}</span>
        <input
          type="number"
          step="any"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Fórmula: √n. Solo números reales no negativos. Ideal para geometría, física o finanzas."
          : "Formula: √n. Real non-negative numbers only. Useful for geometry, physics or finance."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "√144 → 12" : "√144 → 12"}</p>
        <p>{es ? "√2 → 1.41421356" : "√2 → 1.41421356"}</p>
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
