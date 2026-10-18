import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ConeVolumeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [radius, setRadius] = useState("5");
  const [height, setHeight] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(radius);
    const h = parseFloat(height);
    if (isNaN(r) || isNaN(h) || r <= 0 || h <= 0) return null;
    const volume = (1 / 3) * Math.PI * r * r * h;
    return { volume: Math.round(volume * 100) / 100 };
  }, [radius, height]);

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
    setRadius("5");
    setHeight("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Volumen del cono" : "Cone volume"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.volume}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Radio" : "Radius"}</span>
          <input type="number" step="any" min="0" value={radius} onChange={(e) => setRadius(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Radio 5, altura 10 → ≈ 261.80" : "Radius 5, height 10 → ≈ 261.80"}</p>
        <p>{es ? "Radio 3, altura 6 → ≈ 56.55" : "Radius 3, height 6 → ≈ 56.55"}</p>
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
