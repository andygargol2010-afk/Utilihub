import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MaxHeartRateCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(age);
    if (isNaN(a) || a < 10 || a > 100) return null;
    const mhr = 220 - a;
    return { mhr, age: a };
  }, [age]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Frecuencia cardíaca máxima: ${result.mhr} bpm (edad ${result.age})`
      : `Max heart rate: ${result.mhr} bpm (age ${result.age})`;
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
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Frecuencia cardíaca máxima estimada" : "Estimated max heart rate"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.mhr} bpm</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Edad entre 10 y 100" : "Age between 10 and 100"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Edad (años)" : "Age (years)"}</span>
          <input type="number" step="1" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "30 años → 190 bpm" : "30 years → 190 bpm"}</p>
        <p>{es ? "45 años → 175 bpm" : "45 years → 175 bpm"}</p>
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
