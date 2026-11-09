import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageCompleteCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [done, setDone] = useState("25");
  const [total, setTotal] = useState("100");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(done);
    const t = parseFloat(total);
    if (isNaN(d) || isNaN(t) || t <= 0 || d < 0) return null;
    const pct = (d / t) * 100;
    return { pct: Math.round(pct * 100) / 100, done: d, total: t };
  }, [done, total]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Completado: ${result.pct}% (${result.done} de ${result.total})`
      : `Complete: ${result.pct}% (${result.done} of ${result.total})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDone("25");
    setTotal("100");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje completado" : "Percentage complete"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.pct}%</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Total > 0, hecho ≥ 0" : "Total > 0, done ≥ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Hecho" : "Done"}</span>
          <input type="number" step="any" min="0" value={done} onChange={(e) => setDone(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Total" : "Total"}</span>
          <input type="number" step="any" min="1" value={total} onChange={(e) => setTotal(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "25 de 100 → 25%" : "25 of 100 → 25%"}</p>
        <p>{es ? "3 de 4 → 75%" : "3 of 4 → 75%"}</p>
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
