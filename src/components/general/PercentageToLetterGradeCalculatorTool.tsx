import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function letterFromPercent(n: number): { letter: string; range: string } {
  if (n >= 90) return { letter: "A", range: "90–100" };
  if (n >= 80) return { letter: "B", range: "80–89" };
  if (n >= 70) return { letter: "C", range: "70–79" };
  if (n >= 60) return { letter: "D", range: "60–69" };
  return { letter: "F", range: "0–59" };
}

export function PercentageToLetterGradeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [percent, setPercent] = useState("85");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = Number(percent.trim());
    if (percent.trim() === "" || Number.isNaN(n)) {
      return { error: es ? "Introduce un porcentaje válido" : "Enter a valid percentage" };
    }
    if (n < 0 || n > 100) {
      return { error: es ? "El porcentaje debe estar entre 0 y 100" : "Percentage must be between 0 and 100" };
    }
    const { letter, range } = letterFromPercent(n);
    return { n, letter, range };
  }, [percent, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `${result.n}% → ${result.letter} (rango ${result.range})`
      : `${result.n}% → ${result.letter} (range ${result.range})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPercent("85");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.letter}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Rango típico: ${result.range}` : `Typical range: ${result.range}`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un porcentaje" : "Enter a percentage"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Porcentaje (%)" : "Percentage (%)"}</span>
          <input
            type="text"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className={fieldClass}
            placeholder="85"
            inputMode="decimal"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Escala estándar de EE. UU. (A 90–100, B 80–89, C 70–79, D 60–69, F <60). Consulta el silabo de tu institución por variaciones."
          : "Standard US scale (A 90–100, B 80–89, C 70–79, D 60–69, F <60). Check your institution’s syllabus for variations."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "85% → B (80–89)" : "85% → B (80–89)"}</p>
        <p>{es ? "92% → A (90–100)" : "92% → A (90–100)"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-nota-final" : "/tools/calculadora-nota-final"} className="underline text-primary">
            {es ? "Nota final necesaria" : "Final grade needed"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-promedio-examenes" : "/tools/calculadora-promedio-examenes"} className="underline text-primary">
            {es ? "Promedio de exámenes" : "Exam average"}
          </a>
        </p>
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
