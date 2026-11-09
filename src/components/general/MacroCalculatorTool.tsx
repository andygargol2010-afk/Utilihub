import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MacroCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [calories, setCalories] = useState("2000");
  const [proteinPct, setProteinPct] = useState("30");
  const [carbPct, setCarbPct] = useState("40");
  const [fatPct, setFatPct] = useState("30");
  const [copied, setCopied] = useState(false);

  const cal = parseFloat(calories) || 0;
  const pPct = parseFloat(proteinPct) || 0;
  const cPct = parseFloat(carbPct) || 0;
  const fPct = parseFloat(fatPct) || 0;
  const totalPct = pPct + cPct + fPct;

  const proteinG = (cal * (pPct / 100)) / 4;
  const carbG = (cal * (cPct / 100)) / 4;
  const fatG = (cal * (fPct / 100)) / 9;

  async function copy() {
    const text = es
      ? `Calor\u00edas: ${cal}\nProte\u00edna: ${proteinG.toFixed(1)} g (${pPct}%)\nCarbohidratos: ${carbG.toFixed(1)} g (${cPct}%)\nGrasa: ${fatG.toFixed(1)} g (${fPct}%)`
      : `Calories: ${cal}\nProtein: ${proteinG.toFixed(1)} g (${pPct}%)\nCarbs: ${carbG.toFixed(1)} g (${cPct}%)\nFat: ${fatG.toFixed(1)} g (${fPct}%)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCalories("2000");
    setProteinPct("30");
    setCarbPct("40");
    setFatPct("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultados" : "Results"}</p>
        <p className="text-lg font-medium">
          {es ? "Prote\u00edna" : "Protein"}: {proteinG.toFixed(1)} g
        </p>
        <p className="text-lg font-medium">
          {es ? "Carbohidratos" : "Carbs"}: {carbG.toFixed(1)} g
        </p>
        <p className="text-lg font-medium">
          {es ? "Grasa" : "Fat"}: {fatG.toFixed(1)} g
        </p>
        {Math.abs(totalPct - 100) > 0.5 && (
          <p className="text-sm text-amber-600">
            {es
              ? `Los porcentajes suman ${totalPct.toFixed(1)}% (deber\u00edan sumar 100%).`
              : `Percentages sum to ${totalPct.toFixed(1)}% (should total 100%).`}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Calor\u00edas diarias" : "Daily calories"}</span>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className={fieldClass} step="any" min="0" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Prote\u00edna (%)" : "Protein (%)"}</span>
          <input type="number" value={proteinPct} onChange={(e) => setProteinPct(e.target.value)} className={fieldClass} step="any" min="0" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Carbohidratos (%)" : "Carbs (%)"}</span>
          <input type="number" value={carbPct} onChange={(e) => setCarbPct(e.target.value)} className={fieldClass} step="any" min="0" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Grasa (%)" : "Fat (%)"}</span>
          <input type="number" value={fatPct} onChange={(e) => setFatPct(e.target.value)} className={fieldClass} step="any" min="0" />
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
