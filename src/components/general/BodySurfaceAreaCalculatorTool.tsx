import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function BodySurfaceAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (Number.isNaN(h) || Number.isNaN(w) || !Number.isFinite(h) || !Number.isFinite(w)) return null;
    if (h <= 0 || w <= 0) return { error: es ? "La altura y el peso deben ser > 0" : "Height and weight must be > 0" };
    if (h > 250 || w > 300) return { error: es ? "Valores fuera de rango razonable" : "Values outside reasonable range" };
    const bsa = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
    return { bsa, h, w };
  }, [height, weight, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Área de superficie corporal: ${result.bsa.toFixed(2)} m² (h=${result.h} cm, w=${result.w} kg)`
      : `Body surface area: ${result.bsa.toFixed(2)} m² (h=${result.h} cm, w=${result.w} kg)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHeight("170");
    setWeight("70");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área de superficie corporal" : "Body surface area"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.bsa.toFixed(2)} m²</p>
            <p className="text-sm text-muted-foreground">
              {es ? `h = ${result.h} cm · w = ${result.w} kg` : `h = ${result.h} cm · w = ${result.w} kg`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce altura y peso válidos" : "Enter valid height and weight"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input
            type="number"
            min="1"
            step="any"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={fieldClass}
            placeholder="170"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input
            type="number"
            min="1"
            step="any"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={fieldClass}
            placeholder="70"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Fórmula de Du Bois: ASC = 0.007184 × altura^0.725 × peso^0.425. Unidades: cm, kg → m²."
          : "Du Bois formula: BSA = 0.007184 × height^0.725 × weight^0.425. Units: cm, kg → m²."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "170 cm, 70 kg → ~1.81 m²" : "170 cm, 70 kg → ~1.81 m²"}</p>
        <p>{es ? "160 cm, 60 kg → ~1.62 m²" : "160 cm, 60 kg → ~1.62 m²"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-imc" : "/tools/calculadora-imc"} className="underline text-primary">
            {es ? "Calculadora de IMC" : "BMI calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-ratio-cintura-altura" : "/tools/calculadora-ratio-cintura-altura"} className="underline text-primary">
            {es ? "Ratio cintura-altura" : "Waist-to-height ratio"}
          </a>
        </p>
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
