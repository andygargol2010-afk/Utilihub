import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DailyCaloriesCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [activity, setActivity] = useState("1.2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const act = parseFloat(activity);
    if (isNaN(a) || isNaN(w) || isNaN(h) || isNaN(act) || a < 15 || a > 100 || w < 30 || w > 300 || h < 100 || h > 250 || act < 1 || act > 2.5) return null;
    // Mifflin-St Jeor BMR
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * act;
    return { tdee: Math.round(tdee), bmr: Math.round(bmr) };
  }, [age, gender, weight, height, activity]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(String(result.tdee));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAge("30");
    setGender("male");
    setWeight("70");
    setHeight("170");
    setActivity("1.2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calorías diarias (TDEE)" : "Daily calories (TDEE)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.tdee}</p>
            <p className="text-sm text-muted-foreground">{es ? `BMR: ${result.bmr}` : `BMR: ${result.bmr}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Edad" : "Age"}</span>
          <input type="number" min="15" max="100" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Género" : "Gender"}</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={fieldClass}>
            <option value="male">{es ? "Masculino" : "Male"}</option>
            <option value="female">{es ? "Femenino" : "Female"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input type="number" step="any" min="30" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input type="number" step="any" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm sm:col-span-2">
          <span className="font-medium">{es ? "Nivel de actividad" : "Activity level"}</span>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className={fieldClass}>
            <option value="1.2">{es ? "Sedentario (1.2)" : "Sedentary (1.2)"}</option>
            <option value="1.375">{es ? "Ligero (1.375)" : "Light (1.375)"}</option>
            <option value="1.55">{es ? "Moderado (1.55)" : "Moderate (1.55)"}</option>
            <option value="1.725">{es ? "Activo (1.725)" : "Active (1.725)"}</option>
            <option value="1.9">{es ? "Muy activo (1.9)" : "Very active (1.9)"}</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: Mifflin-St Jeor BMR × factor actividad" : "Formula: Mifflin-St Jeor BMR × activity factor"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hombre 30a, 70kg, 170cm, sedentario → ~1850" : "Male 30y, 70kg, 170cm, sedentary → ~1850"}</p>
        <p>{es ? "Mujer 25a, 60kg, 165cm, moderado → ~2000" : "Female 25y, 60kg, 165cm, moderate → ~2000"}</p>
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
