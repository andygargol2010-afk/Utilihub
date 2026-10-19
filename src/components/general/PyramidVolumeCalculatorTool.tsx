import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PyramidVolumeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [baseArea, setBaseArea] = useState("100");
  const [height, setHeight] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(baseArea);
    const h = parseFloat(height);
    if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) return null;
    const volume = (1 / 3) * a * h;
    return { volume: Math.round(volume * 100) / 100 };
  }, [baseArea, height]);

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
    setBaseArea("100");
    setHeight("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Volumen de la pirámide" : "Pyramid volume"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.volume}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Área de la base" : "Base area"}</span>
          <input type="number" step="any" min="0" value={baseArea} onChange={(e) => setBaseArea(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Base 100, altura 10 → 333.33" : "Base 100, height 10 → 333.33"}</p>
        <p>{es ? "Base 25, altura 12 → 100" : "Base 25, height 12 → 100"}</p>
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
