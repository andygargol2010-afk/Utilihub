import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function targetWeight(heightCm: number, targetBmi: number): number | { error: string } {
  if (!Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) return { error: "height" };
  if (!Number.isFinite(targetBmi) || targetBmi < 15 || targetBmi > 40) return { error: "bmi" };
  const hM = heightCm / 100;
  return targetBmi * hM * hM;
}

export function TargetWeightByBmiCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [heightCm, setHeightCm] = useState("175");
  const [targetBmi, setTargetBmi] = useState("22");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(heightCm);
    const b = parseFloat(targetBmi);
    const w = targetWeight(h, b);
    if (typeof w === "object") {
      if (w.error === "height") return { error: es ? "Altura debe estar entre 100 y 250 cm" : "Height must be between 100 and 250 cm" };
      return { error: es ? "IMC objetivo debe estar entre 15 y 40" : "Target BMI must be between 15 and 40" };
    }
    return { weight: w, height: h, bmi: b };
  }, [heightCm, targetBmi, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.weight.toFixed(1) + " kg";
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHeightCm("175");
    setTargetBmi("22");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Peso objetivo" : "Target weight"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.weight.toFixed(1)} kg</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Para altura ${result.height} cm e IMC objetivo ${result.bmi}`
                : `For height ${result.height} cm and target BMI ${result.bmi}`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa valores" : "Enter values"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input
            type="number"
            step="any"
            min="100"
            max="250"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            className={fieldClass}
            placeholder="175"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "IMC objetivo" : "Target BMI"}</span>
          <input
            type="number"
            step="any"
            min="15"
            max="40"
            value={targetBmi}
            onChange={(e) => setTargetBmi(e.target.value)}
            className={fieldClass}
            placeholder="22"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Peso (kg) = IMC × (altura en m)². Rango saludable típico 18.5–24.9."
          : "Weight (kg) = BMI × (height in m)². Typical healthy range 18.5–24.9."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>175 cm, IMC 22 → 67.4 kg</p>
        <p>160 cm, IMC 24 → 61.4 kg</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-imc" : "/tools/calculadora-imc"} className="underline text-primary">
            {es ? "Calculadora de IMC" : "BMI calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/peso-ideal" : "/tools/peso-ideal"} className="underline text-primary">
            {es ? "Peso ideal" : "Ideal weight"}
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
