import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageChangeTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [original, setOriginal] = useState("100");
  const [newValue, setNewValue] = useState("120");
  const [copied, setCopied] = useState(false);

  const origNum = parseFloat(original) || 0;
  const newNum = parseFloat(newValue) || 0;

  const absChange = newNum - origNum;
  const percentChange = origNum !== 0 ? (absChange / Math.abs(origNum)) * 100 : null;
  const isIncrease = absChange > 0;
  const isDecrease = absChange < 0;
  const undefinedLabel = es ? "no definido (valor original 0)" : "undefined (original value is 0)";

  async function copy() {
    const text = es
      ? `Cambio absoluto: ${absChange.toFixed(2)}
Cambio porcentual: ${percentChange === null ? undefinedLabel : percentChange.toFixed(2) + "%"}`
      : `Absolute change: ${absChange.toFixed(2)}
Percentage change: ${percentChange === null ? undefinedLabel : percentChange.toFixed(2) + "%"}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setOriginal("100");
    setNewValue("120");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultados" : "Results"}</p>
        <p className="text-lg font-medium">
          {es ? "Cambio absoluto" : "Absolute change"}: {absChange.toFixed(2)}
        </p>
        <p className="text-lg font-medium">
          {es ? "Cambio porcentual" : "Percentage change"}:{" "}
          {percentChange === null ? undefinedLabel : `${percentChange.toFixed(2)}%`}
          {percentChange !== null && isIncrease ? (es ? " (aumento)" : " (increase)") : percentChange !== null && isDecrease ? (es ? " (disminuci\u00f3n)" : " (decrease)") : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor original" : "Original value"}</span>
          <input type="number" value={original} onChange={(e) => setOriginal(e.target.value)} className={fieldClass} step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Nuevo valor" : "New value"}</span>
          <input type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} className={fieldClass} step="any" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
