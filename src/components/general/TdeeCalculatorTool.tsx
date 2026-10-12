import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TdeeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("70");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [height, setHeight] = useState("175");
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active" | "very">("moderate");
  const [copied, setCopied] = useState(false);

  const kg = useMemo(() => {
    const w = parseFloat(weight) || 0;
    return weightUnit === "lb" ? w * 0.453592 : w;
  }, [weight, weightUnit]);

  const cm = useMemo(() => {
    const h = parseFloat(height) || 0;
    return heightUnit === "in" ? h * 2.54 : h;
  }, [height, heightUnit]);

  const result = useMemo(() => {
    const a = parseInt(age, 10) || 0;
    if (a < 10 || a > 100 || kg < 20 || kg > 300 || cm < 100 || cm > 250) return null;
    const s = sex === "male" ? 5 : -161;
    const bmr = 10 * kg + 6.25 * cm - 5 * a + s;
    const factors: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very: 1.9,
    };
    const tdee = bmr * factors[activity];
    return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
  }, [age, sex, kg, cm, activity]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `BMR: ${result.bmr} kcal · TDEE: ${result.tdee} kcal (mantenimiento)`
      : `BMR: ${result.bmr} kcal · TDEE: ${result.tdee} kcal (maintenance)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAge("30");
    setSex("male");
    setWeight("70");
    setWeightUnit("kg");
    setHeight("175");
    setHeightUnit("cm");
    setActivity("moderate");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Gasto energético diario total (TDEE)" : "Total Daily Energy Expenditure (TDEE)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.tdee} kcal</p>
            <p className="text-sm text-muted-foreground">
              {es ? `BMR: ${result.bmr} kcal` : `BMR: ${result.bmr} kcal`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresá datos válidos" : "Enter valid data"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Edad" : "Age"}</span>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} min="10" max="100" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Sexo" : "Sex"}</span>
          <select value={sex} onChange={(e) => setSex(e.target.value as "male" | "female")} className={fieldClass}>
            <option value="male">{es ? "Hombre" : "Male"}</option>
            <option value="female">{es ? "Mujer" : "Female"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso" : "Weight"}</span>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} min="20" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad peso" : "Weight unit"}</span>
          <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value as "kg" | "lb")} className={fieldClass}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} min="100" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad altura" : "Height unit"}</span>
          <select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value as "cm" | "in")} className={fieldClass}>
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm sm:col-span-2">
          <span className="font-medium">{es ? "Nivel de actividad" : "Activity level"}</span>
          <select value={activity} onChange={(e) => setActivity(e.target.value as typeof activity)} className={fieldClass}>
            <option value="sedentary">{es ? "Sedentario (poco o nada de ejercicio)" : "Sedentary (little or no exercise)"}</option>
            <option value="light">{es ? "Ligero (1-3 días/semana)" : "Light (1-3 days/week)"}</option>
            <option value="moderate">{es ? "Moderado (3-5 días/semana)" : "Moderate (3-5 days/week)"}</option>
            <option value="active">{es ? "Activo (6-7 días/semana)" : "Active (6-7 days/week)"}</option>
            <option value="very">{es ? "Muy activo (trabajo físico + ejercicio)" : "Very active (physical job + exercise)"}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
