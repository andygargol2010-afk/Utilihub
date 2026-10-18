import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SphereVolumeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [radius, setRadius] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(radius);
    if (isNaN(r) || r < 0) return null;
    const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
    return { volume: Math.round(volume * 100) / 100 };
  }, [radius]);

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
    setRadius("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Volumen de la esfera" : "Sphere volume"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.volume}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un radio válido (≥ 0)" : "Enter a valid radius (≥ 0)"}</p>
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
        <p>{es ? "Radio 1 → ~4.19" : "Radius 1 → ~4.19"}</p>
        <p>{es ? "Radio 2 → ~33.51" : "Radius 2 → ~33.51"}</p>
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
