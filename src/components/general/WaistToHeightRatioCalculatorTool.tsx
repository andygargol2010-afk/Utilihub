import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WaistToHeightRatioCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [waist, setWaist] = useState("80");
  const [height, setHeight] = useState("170");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(waist);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;
    const ratio = w / h;
    let category = "";
    if (ratio < 0.5) category = es ? "Saludable" : "Healthy";
    else if (ratio < 0.6) category = es ? "Riesgo aumentado" : "Increased risk";
    else category = es ? "Riesgo alto" : "High risk";
    return { ratio: ratio.toFixed(3), category };
  }, [waist, height, es]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.ratio);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setWaist("80"); setHeight("170"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado (WHtR)" : "Result (WHtR)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.ratio}</p>
            <p className="text-lg">{result.category}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cintura (cm)" : "Waist (cm)"}</span>
          <input type="number" min={1} step="any" value={waist} onChange={(e) => setWaist(e.target.value)} className={fieldClass} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input type="number" min={1} step="any" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "WHtR = cintura / altura. <0.5 saludable. Mide en las mismas unidades." : "WHtR = waist / height. <0.5 healthy. Measure in the same units."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "80 cm / 170 cm → 0.471 (Saludable)" : "80 cm / 170 cm → 0.471 (Healthy)"}</p>
        <p>{es ? "100 cm / 165 cm → 0.606 (Riesgo alto)" : "100 cm / 165 cm → 0.606 (High risk)"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p><a href={es ? "/es/herramientas/calculadora-imc" : "/tools/calculadora-imc"} className="underline">{es ? "Calculadora de IMC" : "BMI calculator"}</a></p>
        <p><a href={es ? "/es/herramientas/calculadora-ciclo-sueno" : "/tools/calculadora-ciclo-sueno"} className="underline">{es ? "Calculadora de ciclo de sueño" : "Sleep cycle calculator"}</a></p>
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
