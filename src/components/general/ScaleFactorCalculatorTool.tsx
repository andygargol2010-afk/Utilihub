import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ScaleFactorCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [original, setOriginal] = useState("10");
  const [scaled, setScaled] = useState("20");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const o = parseFloat(original);
    const s = parseFloat(scaled);
    if (!Number.isFinite(o) || !Number.isFinite(s) || o <= 0) return null;
    const factor = s / o;
    const percent = factor * 100;
    return {
      factor: Math.round(factor * 10000) / 10000,
      percent: Math.round(percent * 100) / 100,
    };
  }, [original, scaled]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Factor: ${result.factor} (${result.percent}%)`
      : `Factor: ${result.factor} (${result.percent}%)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setOriginal("10");
    setScaled("20");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{es ? `Factor: ${result.factor}` : `Factor: ${result.factor}`}</p>
            <p className="text-lg font-medium">{es ? `Porcentaje: ${result.percent}%` : `Percentage: ${result.percent}%`}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `factor = escalado / original` : `factor = scaled / original`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce original > 0 y tamaño escalado" : "Enter original > 0 and scaled size"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tamaño original" : "Original size"}</span>
          <input type="number" value={original} onChange={(e) => setOriginal(e.target.value)} className={fieldClass} placeholder="10" min="0" step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tamaño escalado" : "Scaled size"}</span>
          <input type="number" value={scaled} onChange={(e) => setScaled(e.target.value)} className={fieldClass} placeholder="20" step="any" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "El factor de escala indica cuánto se ha ampliado o reducido un objeto. 1 = mismo tamaño, >1 ampliación, <1 reducción."
          : "The scale factor shows how much an object has been enlarged or reduced. 1 = same size, >1 enlargement, <1 reduction."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 → 20 = factor 2 (200%)" : "10 → 20 = factor 2 (200%)"}</p>
        <p>{es ? "100 → 75 = factor 0.75 (75%)" : "100 → 75 = factor 0.75 (75%)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-relacion-aspecto" : "/calculadora-relacion-aspecto"} className="underline">
            {es ? "Calculadora de relación de aspecto" : "Aspect ratio calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-ratio-dorado" : "/calculadora-ratio-dorado"} className="underline">
            {es ? "Calculadora de ratio dorado" : "Golden ratio calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
