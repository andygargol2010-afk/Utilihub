import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CaloriesBurnedCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [weight, setWeight] = useState("70");
  const [minutes, setMinutes] = useState("30");
  const [met, setMet] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const m = parseFloat(minutes);
    const metVal = parseFloat(met);
    if (isNaN(w) || isNaN(m) || isNaN(metVal) || w <= 0 || m <= 0 || metVal <= 0) return null;
    // kcal = MET * weight_kg * hours
    const hours = m / 60;
    const kcal = metVal * w * hours;
    return { kcal: Math.round(kcal * 10) / 10 };
  }, [weight, minutes, met]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Calorías: ${result.kcal} kcal` : `Calories: ${result.kcal} kcal`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWeight("70");
    setMinutes("30");
    setMet("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calorías quemadas estimadas" : "Estimated calories burned"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.kcal} kcal</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input type="number" step="any" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Duración (min)" : "Duration (min)"}</span>
          <input type="number" step="any" min="0" value={minutes} onChange={(e) => setMinutes(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">MET</span>
          <input type="number" step="any" min="0" value={met} onChange={(e) => setMet(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "70 kg, 30 min, MET 5 → 175 kcal" : "70 kg, 30 min, MET 5 → 175 kcal"}</p>
        <p>{es ? "80 kg, 60 min, MET 8 → 640 kcal" : "80 kg, 60 min, MET 8 → 640 kcal"}</p>
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
