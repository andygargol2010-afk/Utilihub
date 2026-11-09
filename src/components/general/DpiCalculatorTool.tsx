import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DpiCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [diagonal, setDiagonal] = useState("24");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(diagonal);
    if (isNaN(w) || isNaN(h) || isNaN(d) || w <= 0 || h <= 0 || d <= 0 || w > 20000 || h > 20000 || d > 100) return null;
    const dpi = Math.sqrt(w * w + h * h) / d;
    return { dpi: dpi.toFixed(2) };
  }, [width, height, diagonal]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.dpi} DPI`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWidth("1920");
    setHeight("1080");
    setDiagonal("24");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Densidad de píxeles (DPI / PPI)" : "Pixel density (DPI / PPI)"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.dpi} DPI</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (> 0)" : "Valid values required (> 0)"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho (px)" : "Width (px)"}</span>
          <input type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Alto (px)" : "Height (px)"}</span>
          <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Diagonal (pulgadas)" : "Diagonal (inches)"}</span>
          <input type="number" min="0.1" step="0.1" value={diagonal} onChange={(e) => setDiagonal(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: DPI = √(ancho² + alto²) / diagonal" : "Formula: DPI = √(width² + height²) / diagonal"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1920×1080, 24\" → ~91.79 DPI" : "1920×1080, 24\" → ~91.79 DPI"}</p>
        <p>{es ? "2560×1440, 27\" → ~108.79 DPI" : "2560×1440, 27\" → ~108.79 DPI"}</p>
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
