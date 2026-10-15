import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageOfTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [part, setPart] = useState("25");
  const [whole, setWhole] = useState("100");
  const [percent, setPercent] = useState("20");
  const [number, setNumber] = useState("150");
  const [copied, setCopied] = useState(false);

  const partNum = parseFloat(part) || 0;
  const wholeNum = parseFloat(whole) || 0;
  const percentNum = parseFloat(percent) || 0;
  const numberNum = parseFloat(number) || 0;

  const whatPercent = wholeNum !== 0 ? (partNum / wholeNum) * 100 : 0;
  const percentOf = (percentNum / 100) * numberNum;

  async function copy() {
    const text = es
      ? `Qué porcentaje es ${part} de ${whole}: ${whatPercent.toFixed(2)}%\n${percent}% de ${number}: ${percentOf.toFixed(2)}`
      : `What percent is ${part} of ${whole}: ${whatPercent.toFixed(2)}%\n${percent}% of ${number}: ${percentOf.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPart("25");
    setWhole("100");
    setPercent("20");
    setNumber("150");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultados" : "Results"}</p>
        <p className="text-lg font-medium">
          {es ? `Qué porcentaje es ${part} de ${whole}` : `What percent is ${part} of ${whole}`}: {whatPercent.toFixed(2)}%
        </p>
        <p className="text-lg font-medium">
          {es ? `${percent}% de ${number}` : `${percent}% of ${number}`}: {percentOf.toFixed(2)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Parte" : "Part"}</span>
          <input type="number" value={part} onChange={(e) => setPart(e.target.value)} className={fieldClass} step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Total" : "Whole"}</span>
          <input type="number" value={whole} onChange={(e) => setWhole(e.target.value)} className={fieldClass} step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Porcentaje" : "Percentage"}</span>
          <input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className={fieldClass} step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Número" : "Number"}</span>
          <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} className={fieldClass} step="any" />
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
