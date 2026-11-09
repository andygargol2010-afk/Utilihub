import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function VacationDaysCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [annual, setAnnual] = useState("20");
  const [used, setUsed] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(annual);
    const u = parseFloat(used);
    if (isNaN(a) || isNaN(u) || a < 0 || a > 365 || u < 0 || u > 365) return null;
    const remaining = Math.max(0, a - u);
    const over = u > a;
    return { remaining: Math.round(remaining), over };
  }, [annual, used]);

  async function copy() {
    if (!result) return;
    const text = `${result.remaining}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setAnnual("20"); setUsed("5"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Días restantes" : "Remaining days"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.remaining}</p>
            {result.over && <p className="text-sm text-muted-foreground">{es ? "Has superado el límite anual" : "You have exceeded the annual limit"}</p>}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos: 0-365 días" : "Valid values: 0-365 days"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Días anuales" : "Annual days"}</span>
        <input type="number" step="1" min="0" max="365" value={annual} onChange={(e) => setAnnual(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Días usados" : "Days used"}</span>
        <input type="number" step="1" min="0" max="365" value={used} onChange={(e) => setUsed(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: restantes = max(0, anuales - usados)." : "Formula: remaining = max(0, annual - used)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "20 anuales, 5 usados → 15 restantes" : "20 annual, 5 used → 15 remaining"}</p>
        <p>{es ? "15 anuales, 15 usados → 0 restantes" : "15 annual, 15 used → 0 remaining"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar días restantes" : "Copy remaining days"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
