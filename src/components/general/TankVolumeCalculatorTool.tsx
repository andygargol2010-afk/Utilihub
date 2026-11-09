import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TankVolumeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [diameter, setDiameter] = useState("100");
  const [height, setHeight] = useState("50");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(diameter);
    const h = parseFloat(height);
    if (!Number.isFinite(d) || !Number.isFinite(h) || d <= 0 || h <= 0) return null;
    const radius = d / 2;
    const volumeCm3 = Math.PI * radius * radius * h;
    const liters = Math.round((volumeCm3 / 1000) * 10) / 10;
    return { liters };
  }, [diameter, height]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Volumen: ${result.liters} L (diámetro ${diameter} cm, altura ${height} cm)`
      : `Volume: ${result.liters} L (diameter ${diameter} cm, height ${height} cm)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDiameter("100");
    setHeight("50");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Volumen del tanque" : "Tank volume"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.liters} L</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Diámetro > 0, altura > 0" : "Diameter > 0, height > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Diámetro (cm)" : "Diameter (cm)"}</span>
        <input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} className={fieldClass} placeholder="100" min="0" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} placeholder="50" min="0" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Volumen de tanque cilíndrico: π × (diámetro/2)² × altura, en litros." : "Cylindrical tank volume: π × (diameter/2)² × height, in liters."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Diámetro 100 cm, altura 50 cm → 392.7 L" : "Diameter 100 cm, height 50 cm → 392.7 L"}</p>
        <p>{es ? "Diámetro 60 cm, altura 100 cm → 282.7 L" : "Diameter 60 cm, height 100 cm → 282.7 L"}</p>
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
