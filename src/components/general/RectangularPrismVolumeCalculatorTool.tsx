import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RectangularPrismVolumeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [height, setHeight] = useState("3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) return null;
    const volume = l * w * h;
    return { volume: Math.round(volume * 100) / 100 };
  }, [length, width, height]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Volumen: ${result.volume}` : `Volume: ${result.volume}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength("5");
    setWidth("4");
    setHeight("3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Volumen del prisma rectangular" : "Rectangular prism volume"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.volume}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce longitud, ancho y altura > 0" : "Enter length, width and height > 0"}</p>
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
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "5 × 4 × 3 → 60" : "5 × 4 × 3 → 60"}</p>
        <p>{es ? "10 × 2.5 × 4 → 100" : "10 × 2.5 × 4 → 100"}</p>
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
