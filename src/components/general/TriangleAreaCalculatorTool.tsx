import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TriangleAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [base, setBase] = useState("10");
  const [height, setHeight] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const b = parseFloat(base);
    const h = parseFloat(height);
    if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) return null;
    const area = (b * h) / 2;
    return { area: Math.round(area * 100) / 100 };
  }, [base, height]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `\u00c1rea: ${result.area}` : `Area: ${result.area}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBase("10");
    setHeight("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "\u00c1rea del tri\u00e1ngulo" : "Triangle area"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.area}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores v\u00e1lidos > 0" : "Enter valid values > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Base" : "Base"}</span>
          <input type="number" step="any" min="0" value={base} onChange={(e) => setBase(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Base 10, altura 5 \u2192 25" : "Base 10, height 5 \u2192 25"}</p>
        <p>{es ? "Base 8, altura 6 \u2192 24" : "Base 8, height 6 \u2192 24"}</p>
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
