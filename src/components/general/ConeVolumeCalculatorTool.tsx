import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ConeVolumeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [radius, setRadius] = useState("3");
  const [height, setHeight] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(radius);
    const h = parseFloat(height);
    if (isNaN(r) || isNaN(h) || r < 0 || h < 0 || r > 1e6 || h > 1e6) return null;
    const vol = (1 / 3) * Math.PI * r * r * h;
    const base = Math.PI * r * r;
    return {
      volume: vol.toFixed(4),
      baseArea: base.toFixed(4),
    };
  }, [radius, height]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.volume);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRadius("3");
    setHeight("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Volumen del cono" : "Cone volume"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.volume}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Área de la base: ${result.baseArea}` : `Base area: ${result.baseArea}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Radio y altura ≥ 0 requeridos" : "Radius and height ≥ 0 required"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Radio (r)" : "Radius (r)"}</span>
          <input type="number" step="any" min="0" value={radius} onChange={(e) => setRadius(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (h)" : "Height (h)"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: V = (1/3) π r² h" : "Formula: V = (1/3) π r² h"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "r = 3, h = 5 → ~47.1239" : "r = 3, h = 5 → ~47.1239"}</p>
        <p>{es ? "r = 2, h = 10 → ~41.8879" : "r = 2, h = 10 → ~41.8879"}</p>
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
