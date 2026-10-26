import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DensityCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("10");
  const [volume, setVolume] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(volume);
    if (!Number.isFinite(m) || !Number.isFinite(v) || m < 0 || v <= 0) return null;
    const density = m / v;
    return { density: Math.round(density * 1000) / 1000 };
  }, [mass, volume]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Densidad: ${result.density} g/cm³ (masa ${mass} g / volumen ${volume} cm³)`
      : `Density: ${result.density} g/cm³ (mass ${mass} g / volume ${volume} cm³)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMass("10");
    setVolume("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Densidad" : "Density"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.density} g/cm³</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Masa ≥ 0, volumen > 0" : "Mass ≥ 0, volume > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Masa (g)" : "Mass (g)"}</span>
        <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} className={fieldClass} placeholder="10" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Volumen (cm³ o ml)" : "Volume (cm³ or ml)"}</span>
        <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className={fieldClass} placeholder="5" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula la densidad como masa dividida por volumen." : "Calculate density as mass divided by volume."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 g / 5 cm³ → 2 g/cm³" : "10 g / 5 cm³ → 2 g/cm³"}</p>
        <p>{es ? "20 g / 8 cm³ → 2.5 g/cm³" : "20 g / 8 cm³ → 2.5 g/cm³"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
