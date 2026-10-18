import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CircleCircumferenceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [radius, setRadius] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(radius);
    if (isNaN(r) || r < 0) return null;
    const circ = 2 * Math.PI * r;
    return { circ: Math.round(circ * 10000) / 10000 };
  }, [radius]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Circunferencia: ${result.circ}` : `Circumference: ${result.circ}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRadius("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Circunferencia del círculo" : "Circle circumference"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.circ}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce radio ≥ 0" : "Enter radius ≥ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Radio" : "Radius"}</span>
          <input type="number" step="any" min="0" value={radius} onChange={(e) => setRadius(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Radio 1 → 6.2832" : "Radius 1 → 6.2832"}</p>
        <p>{es ? "Radio 2 → 12.5664" : "Radius 2 → 12.5664"}</p>
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
