import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function KineticEnergyTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("1");
  const [velocity, setVelocity] = useState("10");
  const [massUnit, setMassUnit] = useState("kg");
  const [velUnit, setVelUnit] = useState("m/s");
  const [copied, setCopied] = useState(false);

  const mRaw = parseFloat(mass) || 0;
  const vRaw = parseFloat(velocity) || 0;

  const m = massUnit === "kg" ? mRaw : massUnit === "g" ? mRaw / 1000 : mRaw * 0.453592;
  const v = velUnit === "m/s" ? vRaw : velUnit === "km/h" ? vRaw / 3.6 : vRaw * 0.44704;

  const ke = 0.5 * m * v * v;

  async function copy() {
    const text = es
      ? `Masa: ${mRaw} ${massUnit}\nVelocidad: ${vRaw} ${velUnit}\nEnergía cinética: ${ke.toFixed(2)} J`
      : `Mass: ${mRaw} ${massUnit}\nVelocity: ${vRaw} ${velUnit}\nKinetic energy: ${ke.toFixed(2)} J`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMass("1");
    setVelocity("10");
    setMassUnit("kg");
    setVelUnit("m/s");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Energía cinética" : "Kinetic energy"}</p>
        <p className="text-2xl font-semibold">{ke.toFixed(2)} J</p>
        <p className="text-xs text-muted-foreground">KE = ½ m v²</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Masa" : "Mass"}</span>
          <div className="flex gap-2">
            <input type="number" value={mass} onChange={(e) => setMass(e.target.value)} className={fieldClass} step="any" min="0" />
            <select value={massUnit} onChange={(e) => setMassUnit(e.target.value)} className={fieldClass}>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Velocidad" : "Velocity"}</span>
          <div className="flex gap-2">
            <input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} className={fieldClass} step="any" min="0" />
            <select value={velUnit} onChange={(e) => setVelUnit(e.target.value)} className={fieldClass}>
              <option value="m/s">m/s</option>
              <option value="km/h">km/h</option>
              <option value="mph">mph</option>
            </select>
          </div>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
