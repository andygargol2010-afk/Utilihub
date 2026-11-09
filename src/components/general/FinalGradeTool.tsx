import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FinalGradeTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [current, setCurrent] = useState("80");
  const [weight, setWeight] = useState("30");
  const [desired, setDesired] = useState("85");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(current);
    const w = parseFloat(weight) / 100;
    const d = parseFloat(desired);
    if (isNaN(c) || isNaN(w) || isNaN(d) || w <= 0 || w > 1 || c < 0 || d < 0) return null;
    const needed = (d - c * (1 - w)) / w;
    return { needed: Math.round(needed * 10) / 10, current: c, weight: parseFloat(weight), desired: d };
  }, [current, weight, desired]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Necesitas ${result.needed}% en el final (peso ${result.weight}%) para llegar a ${result.desired}%`
      : `Need ${result.needed}% on the final (weight ${result.weight}%) to reach ${result.desired}%`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCurrent("80");
    setWeight("30");
    setDesired("85");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Nota necesaria en el final" : "Score needed on final"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.needed}%</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Para alcanzar ${result.desired}% (actual ${result.current}%, peso final ${result.weight}%)`
                : `To reach ${result.desired}% (current ${result.current}%, final weight ${result.weight}%)`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Datos inválidos" : "Invalid inputs"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Nota actual (%)" : "Current grade (%)"}</span>
          <input type="number" min="0" max="100" step="0.1" value={current} onChange={(e) => setCurrent(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso del final (%)" : "Final weight (%)"}</span>
          <input type="number" min="1" max="100" step="1" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Nota deseada (%)" : "Desired grade (%)"}</span>
          <input type="number" min="0" max="100" step="0.1" value={desired} onChange={(e) => setDesired(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Actual 70%, peso 40%, deseado 80% → ~95%" : "Current 70%, weight 40%, desired 80% → ~95%"}</p>
        <p>{es ? "Actual 90%, peso 20%, deseado 92% → ~100%" : "Current 90%, weight 20%, desired 92% → ~100%"}</p>
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
