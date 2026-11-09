import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RectangleAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState("1");
  const [width, setWidth] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (isNaN(l) || isNaN(w) || l < 0 || w < 0) return null;
    const area = l * w;
    return { area: Math.round(area * 10000) / 10000 };
  }, [length, width]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Área: ${result.area}` : `Area: ${result.area}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength("1");
    setWidth("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área del rectángulo" : "Rectangle area"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.area}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce longitud y ancho ≥ 0" : "Enter length and width ≥ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Longitud" : "Length"}</span>
          <input type="number" step="any" min="0" value={length} onChange={(e) => setLength(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho" : "Width"}</span>
          <input type="number" step="any" min="0" value={width} onChange={(e) => setWidth(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 × 3 → 6" : "2 × 3 → 6"}</p>
        <p>{es ? "5.5 × 4 → 22" : "5.5 × 4 → 22"}</p>
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
