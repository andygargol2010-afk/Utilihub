import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ExamAverageCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [scoresText, setScoresText] = useState("85, 92, 78, 95");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const parts = scoresText.split(/[,\n\s]+/).map(s => s.trim()).filter(Boolean);
    const scores = parts.map(p => parseFloat(p)).filter(n => !Number.isNaN(n) && Number.isFinite(n));
    if (scores.length === 0) return null;
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = sum / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return { count: scores.length, sum, avg, min, max, scores };
  }, [scoresText]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Promedio: ${result.avg.toFixed(2)} (de ${result.count} notas)`
      : `Average: ${result.avg.toFixed(2)} (from ${result.count} scores)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setScoresText("85, 92, 78, 95");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Promedio de exámenes" : "Exam average"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.avg.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `de ${result.count} notas · min ${result.min} · max ${result.max}` : `from ${result.count} scores · min ${result.min} · max ${result.max}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce al menos una nota válida" : "Enter at least one valid score"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Notas (separadas por coma o salto de línea)" : "Scores (comma or newline separated)"}</span>
        <textarea
          value={scoresText}
          onChange={(e) => setScoresText(e.target.value)}
          className={fieldClass}
          rows={4}
          placeholder="85, 92, 78, 95"
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula el promedio aritmético de las notas de exámenes. Valores no numéricos se ignoran."
          : "Calculates the arithmetic mean of exam scores. Non-numeric values are ignored."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "85, 90, 75 → promedio 83.33" : "85, 90, 75 → average 83.33"}</p>
        <p>{es ? "100, 80, 90, 70 → promedio 85" : "100, 80, 90, 70 → average 85"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-promedio-simple" : "/tools/calculadora-promedio-simple"} className="underline text-primary">
            {es ? "Promedio simple" : "Simple average"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-nota-necesaria" : "/tools/calculadora-nota-necesaria"} className="underline text-primary">
            {es ? "Nota necesaria" : "Grade needed"}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar promedio" : "Copy average"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
