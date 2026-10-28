import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function BmiCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const hCm = parseFloat(height);
    if (isNaN(w) || isNaN(hCm) || w <= 0 || hCm <= 0 || w > 500 || hCm > 300) return null;
    const hM = hCm / 100;
    const bmi = w / (hM * hM);
    return { bmi: Math.round(bmi * 10) / 10, category: getBmiCategory(bmi) };
  }, [weight, height]);

  async function copy() {
    if (!result) return;
    const text = es ? `IMC: ${result.bmi} (${result.category})` : `BMI: ${result.bmi} (${result.category})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setWeight("70"); setHeight("170"); setCopied(false);
  }

  const labels: Record<string, { en: string; es: string }> = {
    underweight: { en: "Underweight", es: "Bajo peso" },
    normal: { en: "Normal", es: "Normal" },
    overweight: { en: "Overweight", es: "Sobrepeso" },
    obese: { en: "Obese", es: "Obesidad" },
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Índice de masa corporal (IMC)" : "Body Mass Index (BMI)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.bmi}</p>
            <p className="text-sm text-muted-foreground">{es ? labels[result.category].es : labels[result.category].en}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (peso 1-500 kg, altura 1-300 cm)" : "Valid values required (weight 1-500 kg, height 1-300 cm)"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
        <input type="number" step="0.1" min="1" max="500" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
        <input type="number" step="0.1" min="1" max="300" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Cálculo estándar IMC = peso (kg) / altura (m)². No sustituye consejo médico." : "Standard BMI = weight (kg) / height (m)². Not medical advice."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "70 kg, 170 cm → IMC ~24.2 (normal)" : "70 kg, 170 cm → BMI ~24.2 (normal)"}</p>
        <p>{es ? "90 kg, 180 cm → IMC ~27.8 (sobrepeso)" : "90 kg, 180 cm → BMI ~27.8 (overweight)"}</p>
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
          <a href={es ? "/es/calculadora-calorias-diarias" : "/calculadora-calorias-diarias"} className="underline">
            {es ? "Calculadora de calorías diarias" : "Daily calories calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-ingesta-agua-diaria" : "/calculadora-ingesta-agua-diaria"} className="underline">
            {es ? "Calculadora de ingesta de agua diaria" : "Daily water intake calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
