import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function GradeNeededCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [currentAvg, setCurrentAvg] = useState("75");
  const [currentWeight, setCurrentWeight] = useState("70");
  const [target, setTarget] = useState("80");
  const [remainingWeight, setRemainingWeight] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(currentAvg);
    const cw = parseFloat(currentWeight);
    const t = parseFloat(target);
    const rw = parseFloat(remainingWeight);
    if ([c, cw, t, rw].some((v) => isNaN(v) || v < 0 || v > 100)) return null;
    if (cw + rw === 0) return null;
    const needed = (t * (cw + rw) - c * cw) / rw;
    return { needed: Number.isFinite(needed) ? needed.toFixed(1) : null, possible: needed <= 100 };
  }, [currentAvg, currentWeight, target, remainingWeight]);

  async function copy() {
    if (!result?.needed) return;
    try {
      await navigator.clipboard.writeText(result.needed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCurrentAvg("75");
    setCurrentWeight("70");
    setTarget("80");
    setRemainingWeight("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Nota necesaria" : "Grade needed"}</p>
        {result?.needed != null ? (
          <>
            <p className="text-3xl font-semibold">{result.needed}%</p>
            {!result.possible && (
              <p className="text-sm text-destructive">{es ? "Objetivo inalcanzable (>100)" : "Target unreachable (>100)"}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores entre 0 y 100" : "Values between 0 and 100"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Promedio actual (%)" : "Current average (%)"}</span>
          <input type="number" min="0" max="100" value={currentAvg} onChange={(e) => setCurrentAvg(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso actual (%)" : "Current weight (%)"}</span>
          <input type="number" min="0" max="100" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Objetivo (%)" : "Target (%)"}</span>
          <input type="number" min="0" max="100" value={target} onChange={(e) => setTarget(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso restante (%)" : "Remaining weight (%)"}</span>
          <input type="number" min="0" max="100" value={remainingWeight} onChange={(e) => setRemainingWeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "75% actual (70%) → objetivo 80% (30% restante) → ~91.7%" : "75% current (70%) → target 80% (30% left) → ~91.7%"}</p>
        <p>{es ? "60% actual (50%) → objetivo 70% (50% restante) → 80%" : "60% current (50%) → target 70% (50% left) → 80%"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result?.needed}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
