import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageRemainingCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [total, setTotal] = useState("100");
  const [used, setUsed] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const t = parseFloat(total);
    const u = parseFloat(used);
    if (!Number.isFinite(t) || !Number.isFinite(u) || t <= 0 || u < 0 || u > 100 || Math.abs(t) > 1e12) return null;
    const remainingPct = 100 - u;
    const remainingValue = t * (remainingPct / 100);
    return { remainingPct: Math.round(remainingPct * 100) / 100, remainingValue: Math.round(remainingValue * 100) / 100, usedValue: Math.round(t * (u / 100) * 100) / 100 };
  }, [total, used]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Restante: ${result.remainingPct}% (${result.remainingValue})`
      : `Remaining: ${result.remainingPct}% (${result.remainingValue})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTotal("100");
    setUsed("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje restante" : "Remaining percentage"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.remainingPct}%</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Valor restante: ${result.remainingValue} · Usado: ${result.usedValue}`
                : `Remaining value: ${result.remainingValue} · Used: ${result.usedValue}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce total > 0 y porcentaje usado 0–100" : "Enter total > 0 and used % 0–100"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Total" : "Total"}</span>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 100" : "e.g. 100"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porcentaje usado (%)" : "Used percentage (%)"}</span>
        <input
          type="number"
          value={used}
          onChange={(e) => setUsed(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 30" : "e.g. 30"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula el porcentaje y el valor que queda después de aplicar un porcentaje usado."
          : "Calculate the remaining percentage and value after applying a used percentage."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Total 100, 30% usado → 70% restante (70)" : "Total 100, 30% used → 70% remaining (70)"}</p>
        <p>{es ? "Total 200, 50% usado → 50% restante (100)" : "Total 200, 50% used → 50% remaining (100)"}</p>
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
