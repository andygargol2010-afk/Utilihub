import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PotentialEnergyCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("10");
  const [height, setHeight] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const h = parseFloat(height);
    if (isNaN(m) || isNaN(h) || m <= 0 || h < 0) return null;
    const pe = m * 9.81 * h;
    return { pe: Math.round(pe * 100) / 100, mass: m, height: h };
  }, [mass, height]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Energía potencial: ${result.pe} J (m=${result.mass} kg, h=${result.height} m)`
      : `Potential energy: ${result.pe} J (m=${result.mass} kg, h=${result.height} m)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMass("10");
    setHeight("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Energía potencial gravitatoria" : "Gravitational potential energy"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.pe} J</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Masa > 0, altura ≥ 0" : "Mass > 0, height ≥ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Masa (kg)" : "Mass (kg)"}</span>
          <input type="number" step="any" min="0" value={mass} onChange={(e) => setMass(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (m)" : "Height (m)"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 kg a 5 m → 490.5 J" : "10 kg at 5 m → 490.5 J"}</p>
        <p>{es ? "2 kg a 10 m → 196.2 J" : "2 kg at 10 m → 196.2 J"}</p>
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
