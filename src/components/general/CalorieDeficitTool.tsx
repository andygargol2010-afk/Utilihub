import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CalorieDeficitTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [tdee, setTdee] = useState("2000");
  const [weeklyKg, setWeeklyKg] = useState("0.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const t = parseFloat(tdee);
    const w = parseFloat(weeklyKg);
    if (isNaN(t) || isNaN(w) || t <= 0) return null;
    const dailyDelta = (w * 7700) / 7;
    const recommended = Math.round(t - dailyDelta);
    return { dailyDelta: Math.round(dailyDelta), recommended, isDeficit: dailyDelta > 0 };
  }, [tdee, weeklyKg]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Calorías recomendadas: ${result.recommended} kcal/día (${result.isDeficit ? "déficit" : "superávit"} de ${Math.abs(result.dailyDelta)} kcal)`
      : `Recommended calories: ${result.recommended} kcal/day (${result.isDeficit ? "deficit" : "surplus"} of ${Math.abs(result.dailyDelta)} kcal)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTdee("2000");
    setWeeklyKg("0.5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calorías recomendadas" : "Recommended calories"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.recommended} kcal</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.isDeficit ? "Déficit" : "Superávit"} diario de ${Math.abs(result.dailyDelta)} kcal`
                : `Daily ${result.isDeficit ? "deficit" : "surplus"} of ${Math.abs(result.dailyDelta)} kcal`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "TDEE (kcal/día)" : "TDEE (kcal/day)"}</span>
          <input type="number" step="any" min="1" value={tdee} onChange={(e) => setTdee(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cambio semanal (kg)" : "Weekly change (kg)"}</span>
          <input type="number" step="0.1" value={weeklyKg} onChange={(e) => setWeeklyKg(e.target.value)} className={fieldClass} />
          <p className="text-xs text-muted-foreground">{es ? "Positivo = pérdida, negativo = ganancia" : "Positive = loss, negative = gain"}</p>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "TDEE 2000, 0.5 kg/semana → ~1450 kcal (déficit ~550)" : "TDEE 2000, 0.5 kg/week → ~1450 kcal (deficit ~550)"}</p>
        <p>{es ? "TDEE 2500, -0.25 kg/semana → ~2750 kcal (superávit ~275)" : "TDEE 2500, -0.25 kg/week → ~2750 kcal (surplus ~275)"}</p>
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
