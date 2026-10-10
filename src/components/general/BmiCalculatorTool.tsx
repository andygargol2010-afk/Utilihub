import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function toKg(value: number, unit: "kg" | "lb") {
  return unit === "kg" ? value : value * 0.45359237;
}

function toMeters(value: number, unit: "cm" | "in" | "m") {
  if (unit === "m") return value;
  if (unit === "cm") return value / 100;
  return value * 0.0254;
}

function classifyBmi(bmi: number, es: boolean) {
  if (bmi < 18.5) return es ? "Bajo peso" : "Underweight";
  if (bmi < 25) return es ? "Peso normal" : "Normal weight";
  if (bmi < 30) return es ? "Sobrepeso" : "Overweight";
  return es ? "Obesidad" : "Obesity";
}

export function BmiCalculatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in" | "m">("cm");

  const result = useMemo(() => {
    const w = Number(weight.replace(",", "."));
    const h = Number(height.replace(",", "."));
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
    const kg = toKg(w, weightUnit);
    const m = toMeters(h, heightUnit);
    if (m <= 0) return null;
    const bmi = kg / (m * m);
    return { bmi, category: classifyBmi(bmi, es) };
  }, [weight, height, weightUnit, heightUnit, es]);

  function reset() {
    setWeight("70");
    setHeight("170");
    setWeightUnit("kg");
    setHeightUnit("cm");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso" : "Weight"}</span>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={fieldClass}
              min={1}
              step="any"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")}
              className="rounded-xl border bg-background px-2 text-sm"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={fieldClass}
              min={1}
              step="any"
            />
            <select
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value as "cm" | "in" | "m")}
              className="rounded-xl border bg-background px-2 text-sm"
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
            </select>
          </div>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      {result ? (
        <div className="rounded-xl border p-4">
          <p className="text-sm font-medium">{es ? "Tu IMC" : "Your BMI"}</p>
          <p className="mt-1 font-mono text-3xl">{result.bmi.toFixed(1)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {es ? "Categoría:" : "Category:"} {result.category}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {es
              ? "Clasificación OMS: <18.5 bajo peso · 18.5–24.9 normal · 25–29.9 sobrepeso · ≥30 obesidad. Orientativo, no sustituye consejo médico."
              : "WHO ranges: <18.5 underweight · 18.5–24.9 normal · 25–29.9 overweight · ≥30 obesity. Indicative only, not medical advice."}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {es ? "Introduce peso y altura válidos." : "Enter valid weight and height."}
        </p>
      )}
    </div>
  );
}
