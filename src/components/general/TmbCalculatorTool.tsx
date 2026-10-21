import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TmbCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [sex, setSex] = useState("male");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(a) || isNaN(w) || isNaN(h) || a <= 0 || a > 120 || w <= 0 || w > 500 || h <= 0 || h > 300) return null;
    const base = 10 * w + 6.25 * h - 5 * a;
    const tmb = sex === "male" ? base + 5 : base - 161;
    return Math.round(tmb);
  }, [age, weight, height, sex]);

  async function copy() {
    if (result === null) return;
    const textOut = `${es ? "TMB" : "BMR"}: ${result} kcal/día`;
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
    setWeight("70");
    setHeight("170");
    setSex("male");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Tasa Metabólica Basal" : "Basal Metabolic Rate"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result} kcal/{es ? "día" : "day"}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Edad (años)" : "Age (years)"}</span>
          <input type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input type="number" step="0.1" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input type="number" step="1" min="50" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Sexo" : "Sex"}</span>
          <select value={sex} onChange={(e) => setSex(e.target.value)} className={fieldClass}>
            <option value="male">{es ? "Masculino" : "Male"}</option>
            <option value="female">{es ? "Femenino" : "Female"}</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hombre 30 años, 70 kg, 170 cm → ~1645 kcal" : "Male 30y, 70 kg, 170 cm → ~1645 kcal"}</p>
        <p>{es ? "Mujer 25 años, 60 kg, 165 cm → ~1380 kcal" : "Female 25y, 60 kg, 165 cm → ~1380 kcal"}</p>
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
