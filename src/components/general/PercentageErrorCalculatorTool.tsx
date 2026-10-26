import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageErrorCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [experimental, setExperimental] = useState("105");
  const [theoretical, setTheoretical] = useState("100");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const e = parseFloat(experimental);
    const t = parseFloat(theoretical);
    if (!Number.isFinite(e) || !Number.isFinite(t)) return { error: "empty" as const };
    if (t === 0) return { error: "zero" as const };
    const error = Math.abs(e - t) / Math.abs(t) * 100;
    return { error: Math.round(error * 100) / 100 };
  }, [experimental, theoretical]);

  async function copy() {
    if ("error" in result) return;
    const text = es
      ? `Error porcentual: ${result.error}% (exp ${experimental} / teor ${theoretical})`
      : `Percentage error: ${result.error}% (exp ${experimental} / theo ${theoretical})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setExperimental("105");
    setTheoretical("100");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Error porcentual" : "Percentage error"}</p>
        {!"error" in result ? (
          <p className="text-3xl font-semibold">{result.error}%</p>
        ) : result.error === "zero" ? (
          <p className="text-sm text-muted-foreground">
            {es ? "Valor teórico ≠ 0" : "Theoretical value ≠ 0"}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá ambos valores numéricos" : "Enter both numeric values"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor experimental" : "Experimental value"}</span>
        <input type="number" value={experimental} onChange={(e) => setExperimental(e.target.value)} className={fieldClass} placeholder="105" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor teórico" : "Theoretical value"}</span>
        <input type="number" value={theoretical} onChange={(e) => setTheoretical(e.target.value)} className={fieldClass} placeholder="100" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula el error porcentual absoluto relativo al valor teórico." : "Calculate absolute percentage error relative to the theoretical value."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Experimental 105, teórico 100 → 5%" : "Experimental 105, theoretical 100 → 5%"}</p>
        <p>{es ? "Experimental 90, teórico 100 → 10%" : "Experimental 90, theoretical 100 → 10%"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={"error" in result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
