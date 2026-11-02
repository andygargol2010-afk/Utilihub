import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function KineticEnergyCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("2");
  const [velocity, setVelocity] = useState("3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const v = parseFloat(velocity);
    if (Number.isNaN(m) || Number.isNaN(v) || !Number.isFinite(m) || !Number.isFinite(v)) return null;
    if (m < 0 || v < 0) return { error: es ? "La masa y la velocidad deben ser ≥ 0" : "Mass and velocity must be ≥ 0" };
    const ke = 0.5 * m * v * v;
    return { ke, m, v };
  }, [mass, velocity, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Energía cinética: ${result.ke.toFixed(2)} J (m=${result.m} kg, v=${result.v} m/s)`
      : `Kinetic energy: ${result.ke.toFixed(2)} J (m=${result.m} kg, v=${result.v} m/s)`;
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
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Energía cinética" : "Kinetic energy"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.ke.toFixed(2)} J</p>
            <p className="text-sm text-muted-foreground">
              {es ? `m = ${result.m} kg · v = ${result.v} m/s` : `m = ${result.m} kg · v = ${result.v} m/s`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce masa y velocidad válidas" : "Enter valid mass and velocity"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Masa (kg)" : "Mass (kg)"}</span>
          <input
            type="number"
            min="0"
            step="any"
            value={mass}
            onChange={(e) => setMass(e.target.value)}
            className={fieldClass}
            placeholder="2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad (m/s)" : "Velocity (m/s)"}</span>
          <input
            type="number"
            min="0"
            step="any"
            value={velocity}
            onChange={(e) => setVelocity(e.target.value)}
            className={fieldClass}
            placeholder="3"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Energía cinética = ½ × masa × velocidad². Unidades SI: kg y m/s → julios (J)."
          : "Kinetic energy = ½ × mass × velocity². SI units: kg and m/s → joules (J)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "m=2 kg, v=3 m/s → 9 J" : "m=2 kg, v=3 m/s → 9 J"}</p>
        <p>{es ? "m=1 kg, v=10 m/s → 50 J" : "m=1 kg, v=10 m/s → 50 J"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-energia-potencial" : "/tools/calculadora-energia-potencial"} className="underline text-primary">
            {es ? "Energía potencial" : "Potential energy"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-fuerza" : "/tools/calculadora-fuerza"} className="underline text-primary">
            {es ? "Fuerza" : "Force"}
          </a>
        </p>
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
