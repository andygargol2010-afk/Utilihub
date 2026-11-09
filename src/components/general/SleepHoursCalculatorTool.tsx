import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function getSleepRecommendation(age: number): { min: number; max: number; label: string } | null {
  if (isNaN(age) || age < 0 || age > 120) return null;
  if (age < 0.25) return { min: 14, max: 17, label: "newborn" };
  if (age < 1) return { min: 12, max: 15, label: "infant" };
  if (age < 3) return { min: 11, max: 14, label: "toddler" };
  if (age < 6) return { min: 10, max: 13, label: "preschool" };
  if (age < 14) return { min: 9, max: 11, label: "school" };
  if (age < 18) return { min: 8, max: 10, label: "teen" };
  if (age < 65) return { min: 7, max: 9, label: "adult" };
  return { min: 7, max: 8, label: "older" };
}

export function SleepHoursCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    return getSleepRecommendation(a);
  }, [age]);

  async function copy() {
    if (!result) return;
    const text = `${result.min}-${result.max} h`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setAge("30"); setCopied(false);
  }

  const labels: Record<string, { en: string; es: string }> = {
    newborn: { en: "Newborn (0-3 months)", es: "Recién nacido (0-3 meses)" },
    infant: { en: "Infant (4-11 months)", es: "Bebé (4-11 meses)" },
    toddler: { en: "Toddler (1-2 years)", es: "Niño pequeño (1-2 años)" },
    preschool: { en: "Preschool (3-5 years)", es: "Preescolar (3-5 años)" },
    school: { en: "School age (6-13 years)", es: "Edad escolar (6-13 años)" },
    teen: { en: "Teen (14-17 years)", es: "Adolescente (14-17 años)" },
    adult: { en: "Adult (18-64 years)", es: "Adulto (18-64 años)" },
    older: { en: "Older adult (65+)", es: "Adulto mayor (65+)" },
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Horas de sueño recomendadas" : "Recommended sleep hours"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.min} – {result.max} {es ? "horas" : "hours"}</p>
            <p className="text-sm text-muted-foreground">{es ? labels[result.label].es : labels[result.label].en}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Edad válida (0-120) requerida" : "Valid age (0-120) required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Edad (años)" : "Age (years)"}</span>
        <input type="number" step="0.1" min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Recomendaciones generales basadas en rangos estándar por edad. No sustituye consejo médico." : "General recommendations based on standard age ranges. Not medical advice."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Edad 30 años → 7-9 horas (adulto)" : "Age 30 years → 7-9 hours (adult)"}</p>
        <p>{es ? "Edad 10 años → 9-11 horas (escolar)" : "Age 10 years → 9-11 hours (school age)"}</p>
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
