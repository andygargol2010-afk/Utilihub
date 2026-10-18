import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DensityCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("1");
  const [volume, setVolume] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(volume);
    if (isNaN(m) || m < 0 || isNaN(v) || v <= 0) return null;
    const density = m / v;
    return { density: Math.round(density * 1000) / 1000 };
  }, [mass, volume]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Densidad: ${result.density}` : `Density: ${result.density}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMass("1");
    setVolume("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Densidad" : "Density"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.density}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce masa ≥ 0 y volumen > 0" : "Enter mass ≥ 0 and volume > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Masa" : "Mass"}</span>
          <input type="number" step="any" min="0" value={mass} onChange={(e) => setMass(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Volumen" : "Volume"}</span>
          <input type="number" step="any" min="0.001" value={volume} onChange={(e) => setVolume(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Masa 1, volumen 1 → 1" : "Mass 1, volume 1 → 1"}</p>
        <p>{es ? "Masa 1000, volumen 1 → 1000" : "Mass 1000, volume 1 → 1000"}</p>
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
