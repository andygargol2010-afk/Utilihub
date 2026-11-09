import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WaterIntakeTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [weight, setWeight] = useState("70");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [activity, setActivity] = useState<"sedentary" | "moderate" | "active">("moderate");
  const [climate, setClimate] = useState<"normal" | "hot">("normal");
  const [copied, setCopied] = useState(false);

  const kg = useMemo(() => {
    const w = parseFloat(weight) || 0;
    return unit === "lb" ? w * 0.453592 : w;
  }, [weight, unit]);

  const ml = useMemo(() => {
    if (kg <= 0) return 0;
    let base = kg * 33; // ~33 ml/kg average
    if (activity === "moderate") base *= 1.15;
    if (activity === "active") base *= 1.3;
    if (climate === "hot") base *= 1.15;
    return Math.round(base);
  }, [kg, activity, climate]);

  const liters = (ml / 1000).toFixed(1);
  const oz = Math.round(ml / 29.5735);

  async function copy() {
    const textOut = es
      ? `Ingesta recomendada: ${liters} L (${ml} ml / ${oz} oz) para ${weight} ${unit}`
      : `Recommended intake: ${liters} L (${ml} ml / ${oz} oz) for ${weight} ${unit}`;
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
    setUnit("kg");
    setActivity("moderate");
    setClimate("normal");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Ingesta diaria estimada" : "Estimated daily intake"}</p>
        <p className="text-3xl font-semibold">{liters} L</p>
        <p className="text-sm text-muted-foreground">
          {es
            ? `${ml} ml · ${oz} oz`
            : `${ml} ml · ${oz} oz`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso" : "Weight"}</span>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} min="1" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad" : "Unit"}</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "kg" | "lb")} className={fieldClass}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Actividad" : "Activity"}</span>
          <select value={activity} onChange={(e) => setActivity(e.target.value as "sedentary" | "moderate" | "active")} className={fieldClass}>
            <option value="sedentary">{es ? "Sedentario" : "Sedentary"}</option>
            <option value="moderate">{es ? "Moderada" : "Moderate"}</option>
            <option value="active">{es ? "Activa" : "Active"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Clima" : "Climate"}</span>
          <select value={climate} onChange={(e) => setClimate(e.target.value as "normal" | "hot")} className={fieldClass}>
            <option value="normal">{es ? "Normal" : "Normal"}</option>
            <option value="hot">{es ? "Caluroso" : "Hot"}</option>
          </select>
        </label>
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
