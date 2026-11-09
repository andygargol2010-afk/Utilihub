import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SquarePerimeterCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [side, setSide] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = parseFloat(side);
    if (isNaN(s) || s < 0 || s > 1e6) return null;
    const perimeter = 4 * s;
    return { perimeter: perimeter.toFixed(4) };
  }, [side]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.perimeter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSide("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Per\u00edmetro del cuadrado" : "Square perimeter"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.perimeter}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Lado \u2265 0 requerido" : "Side \u2265 0 required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Lado (a)" : "Side (a)"}</span>
        <input type="number" step="any" min="0" value={side} onChange={(e) => setSide(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "F\u00f3rmula: P = 4a" : "Formula: P = 4a"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "a = 4 \u2192 16" : "a = 4 \u2192 16"}</p>
        <p>{es ? "a = 5 \u2192 20" : "a = 5 \u2192 20"}</p>
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
