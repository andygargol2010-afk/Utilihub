import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function IdealWeightCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [heightCm, setHeightCm] = useState("170");
  const [sex, setSex] = useState("male");
  const [copied, setCopied] = useState(false);

  const h = parseFloat(heightCm) || 0;
  const inches = h / 2.54;
  const over60 = Math.max(0, inches - 60);

  // Devine
  const devine = sex === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
  // Robinson
  const robinson = sex === "male" ? 52 + 1.9 * over60 : 49 + 1.7 * over60;
  // Miller
  const miller = sex === "male" ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60;

  async function copy() {
    const text = es
      ? `Altura: ${h} cm\nDevine: ${devine.toFixed(1)} kg\nRobinson: ${robinson.toFixed(1)} kg\nMiller: ${miller.toFixed(1)} kg`
      : `Height: ${h} cm\nDevine: ${devine.toFixed(1)} kg\nRobinson: ${robinson.toFixed(1)} kg\nMiller: ${miller.toFixed(1)} kg`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHeightCm("170");
    setSex("male");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Peso ideal estimado" : "Estimated ideal weight"}</p>
        <p className="text-lg font-medium">Devine: {devine.toFixed(1)} kg</p>
        <p className="text-lg font-medium">Robinson: {robinson.toFixed(1)} kg</p>
        <p className="text-lg font-medium">Miller: {miller.toFixed(1)} kg</p>
        {h < 150 && (
          <p className="text-sm text-amber-600">
            {es ? "Fórmulas diseñadas para adultos de altura promedio." : "Formulas designed for average-height adults."}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={fieldClass} step="any" min="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Sexo" : "Sex"}</span>
          <select value={sex} onChange={(e) => setSex(e.target.value)} className={fieldClass}>
            <option value="male">{es ? "Hombre" : "Male"}</option>
            <option value="female">{es ? "Mujer" : "Female"}</option>
          </select>
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
