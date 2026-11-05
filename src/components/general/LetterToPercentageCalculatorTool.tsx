import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const SCALE: Record<string, { min: number; max: number; avg: number }> = {
  "A+": { min: 97, max: 100, avg: 98.5 },
  "A": { min: 93, max: 96, avg: 94.5 },
  "A-": { min: 90, max: 92, avg: 91 },
  "B+": { min: 87, max: 89, avg: 88 },
  "B": { min: 83, max: 86, avg: 84.5 },
  "B-": { min: 80, max: 82, avg: 81 },
  "C+": { min: 77, max: 79, avg: 78 },
  "C": { min: 73, max: 76, avg: 74.5 },
  "C-": { min: 70, max: 72, avg: 71 },
  "D+": { min: 67, max: 69, avg: 68 },
  "D": { min: 63, max: 66, avg: 64.5 },
  "D-": { min: 60, max: 62, avg: 61 },
  "F": { min: 0, max: 59, avg: 50 },
};

export function LetterToPercentageCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [letter, setLetter] = useState("A");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const key = letter.trim().toUpperCase();
    return SCALE[key] || null;
  }, [letter]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Nota ${letter}: ${result.min}–${result.max}% (promedio ${result.avg}%)`
      : `Grade ${letter}: ${result.min}–${result.max}% (average ${result.avg}%)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLetter("A");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje típico" : "Typical percentage"}</p>
        {result ? (
          <>
            <p className="text-2xl font-semibold font-mono">{result.min}–{result.max}%</p>
            <p className="text-sm text-muted-foreground">{es ? `Promedio: ${result.avg}%` : `Average: ${result.avg}%`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Letra no válida (A+, A, B-, C, D+, F)" : "Invalid letter (A+, A, B-, C, D+, F)"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Nota en letra" : "Letter grade"}</span>
        <input
          type="text"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          placeholder="A, B+, C-"
          className={fieldClass}
          maxLength={2}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Escala típica de EE.UU. Las escuelas pueden variar." : "Typical US scale. Schools may differ."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "A → 93–96% (promedio 94.5%)" : "A → 93–96% (average 94.5%)"}</p>
        <p>{es ? "B+ → 87–89% (promedio 88%)" : "B+ → 87–89% (average 88%)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: calculadora-porcentaje-a-letra, calculadora-nota-necesaria" : "Related: calculadora-porcentaje-a-letra, calculadora-nota-necesaria"}
      </p>
    </div>
  );
}
