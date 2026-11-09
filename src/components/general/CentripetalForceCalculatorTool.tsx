import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CentripetalForceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("2");
  const [velocity, setVelocity] = useState("3");
  const [radius, setRadius] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    const r = parseFloat(radius);
    if (!Number.isFinite(m) || m <= 0 || !Number.isFinite(v) || v < 0 || !Number.isFinite(r) || r <= 0) return null;
    const force = (m * v * v) / r;
    return {
      force: Math.round(force * 100) / 100,
    };
  }, [mass, velocity, radius]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Masa ${mass} kg, velocidad ${velocity} m/s, radio ${radius} m → Fuerza centrípeta: ${result.force} N`
      : `Mass ${mass} kg, velocity ${velocity} m/s, radius ${radius} m → Centripetal force: ${result.force} N`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMass("2");
    setVelocity("3");
    setRadius("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Fuerza centrípeta" : "Centripetal force"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold font-mono">{result.force} N</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá masa y radio positivos y velocidad no negativa" : "Enter positive mass and radius, and non-negative velocity"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Masa (kg)" : "Mass (kg)"}</span>
          <input
            type="number"
            step="any"
            min="0.01"
            value={mass}
            onChange={(e) => setMass(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad (m/s)" : "Velocity (m/s)"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={velocity}
            onChange={(e) => setVelocity(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Radio (m)" : "Radius (m)"}</span>
          <input
            type="number"
            step="any"
            min="0.01"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 kg, 3 m/s, 1 m → 18 N" : "2 kg, 3 m/s, 1 m → 18 N"}</p>
        <p>{es ? "5 kg, 10 m/s, 5 m → 100 N" : "5 kg, 10 m/s, 5 m → 100 N"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: calculadora-energia-cinetica, ley-de-ohm" : "Related: calculadora-energia-cinetica, ley-de-ohm"}
      </p>
    </div>
  );
}
