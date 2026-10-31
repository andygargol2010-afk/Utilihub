import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

type CategoryKey = "underweight" | "normal" | "overweight" | "obese";

function getBmiCategory(bmi: number): CategoryKey {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

const CATEGORY_LABEL: Record<Locale, Record<CategoryKey, string>> = {
  en: {
    underweight: "Underweight",
    normal: "Normal weight",
    overweight: "Overweight",
    obese: "Obesity",
  },
  es: {
    underweight: "Bajo peso",
    normal: "Peso normal",
    overweight: "Sobrepeso",
    obese: "Obesidad",
  },
};

const WHO_ROWS: { key: CategoryKey; range: string; rangeEs: string }[] = [
  { key: "underweight", range: "< 18.5", rangeEs: "< 18,5" },
  { key: "normal", range: "18.5 – 24.9", rangeEs: "18,5 – 24,9" },
  { key: "overweight", range: "25 – 29.9", rangeEs: "25 – 29,9" },
  { key: "obese", range: "≥ 30", rangeEs: "≥ 30" },
];

export function BmiCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const loc: Locale = es ? "es" : "en";
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const hCm = parseFloat(height);
    if (isNaN(w) || isNaN(hCm) || w <= 0 || hCm <= 0 || w > 500 || hCm > 300) return null;
    const hM = hCm / 100;
    const bmi = w / (hM * hM);
    const category = getBmiCategory(bmi);
    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      label: CATEGORY_LABEL[loc][category],
    };
  }, [weight, height, loc]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `IMC: ${result.bmi} (${result.label})`
      : `BMI: ${result.bmi} (${result.label})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWeight("70");
    setHeight("170");
    setCopied(false);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {es ? "Índice de masa corporal (IMC)" : "Body Mass Index (BMI)"}
          </p>
          {result ? (
            <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-3xl font-semibold tabular-nums">{result.bmi}</p>
              <p className="text-base font-medium text-primary">{result.label}</p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              {es ? "Ingresá peso y altura válidos." : "Enter a valid weight and height."}
            </p>
          )}
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input
            type="number"
            step="0.1"
            min="1"
            max="500"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={fieldClass}
            inputMode="decimal"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input
            type="number"
            step="0.1"
            min="1"
            max="300"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={fieldClass}
            inputMode="decimal"
          />
        </label>

        <p className="text-sm text-muted-foreground">
          {es
            ? "Fórmula: IMC = peso (kg) ÷ altura (m)². Ejemplo: 70 kg y 170 cm → 24,2. No sustituye consejo médico."
            : "Formula: BMI = weight (kg) ÷ height (m)². Example: 70 kg and 170 cm → 24.2. Not medical advice."}
        </p>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <caption className="border-b bg-muted/30 px-3 py-2 text-left font-medium">
              {es ? "Tabla IMC adultos (OMS)" : "Adult BMI table (WHO)"}
            </caption>
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="px-3 py-2 font-medium">{es ? "Categoría" : "Category"}</th>
                <th className="px-3 py-2 font-medium">{es ? "IMC" : "BMI"}</th>
              </tr>
            </thead>
            <tbody>
              {WHO_ROWS.map((row) => {
                const active = result?.category === row.key;
                return (
                  <tr
                    key={row.key}
                    className={active ? "bg-primary/10 font-medium" : "border-b border-border/60"}
                  >
                    <td className="px-3 py-2">{CATEGORY_LABEL[loc][row.key]}</td>
                    <td className="px-3 py-2 tabular-nums">{es ? row.rangeEs : row.range}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
          <p className="font-medium">{es ? "Ejemplos rápidos" : "Quick examples"}</p>
          <p>{es ? "70 kg, 170 cm → IMC ≈ 24,2 (peso normal)" : "70 kg, 170 cm → BMI ≈ 24.2 (normal)"}</p>
          <p>{es ? "90 kg, 180 cm → IMC ≈ 27,8 (sobrepeso)" : "90 kg, 180 cm → BMI ≈ 27.8 (overweight)"}</p>
          <p>{es ? "55 kg, 165 cm → IMC ≈ 20,2 (peso normal)" : "55 kg, 165 cm → BMI ≈ 20.2 (normal)"}</p>
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
          <p className="flex flex-wrap gap-x-2 gap-y-1">
            <a
              href={es ? "/es/herramientas/calculadora-calorias-diarias" : "/tools/daily-calories-calculator"}
              className="underline"
            >
              {es ? "Calorías diarias" : "Daily calories"}
            </a>
            <span aria-hidden>·</span>
            <a
              href={es ? "/es/herramientas/calculadora-ingesta-agua-diaria" : "/tools/daily-water-intake-calculator"}
              className="underline"
            >
              {es ? "Agua diaria" : "Daily water"}
            </a>
            <span aria-hidden>·</span>
            <a
              href={es ? "/es/herramientas/calculadora-peso-ideal" : "/tools/ideal-weight-calculator"}
              className="underline"
            >
              {es ? "Peso ideal" : "Ideal weight"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
