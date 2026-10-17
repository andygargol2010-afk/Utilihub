import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function FuelEfficiencyTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("100");
  const [fuel, setFuel] = useState("8");
  const [distUnit, setDistUnit] = useState<"km" | "mi">("km");
  const [fuelUnit, setFuelUnit] = useState<"L" | "gal">("L");
  const [copied, setCopied] = useState(false);

  const d = parseFloat(distance) || 0;
  const f = parseFloat(fuel) || 0;

  const distKm = distUnit === "km" ? d : d * 1.60934;
  const fuelL = fuelUnit === "L" ? f : f * 3.78541;

  const lPer100 = fuelL > 0 && distKm > 0 ? (fuelL / distKm) * 100 : null;
  const kmPerL = fuelL > 0 ? distKm / fuelL : null;
  const mpg = f > 0 && d > 0 ? (distUnit === "mi" ? d : d / 1.60934) / (fuelUnit === "gal" ? f : f / 3.78541) : null;

  const result = lPer100 !== null
    ? es
      ? `Eficiencia: ${lPer100.toFixed(2)} L/100km | ${kmPerL?.toFixed(2)} km/L | ${mpg?.toFixed(2)} MPG`
      : `Efficiency: ${lPer100.toFixed(2)} L/100km | ${kmPerL?.toFixed(2)} km/L | ${mpg?.toFixed(2)} MPG`
    : es ? "Distancia y combustible deben ser > 0" : "Distance and fuel must be > 0";

  async function copy() {
    if (lPer100 === null) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setDistance("100");
    setFuel("8");
    setDistUnit("km");
    setFuelUnit("L");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Eficiencia de combustible" : "Fuel efficiency"}</p>
        <p className="text-3xl font-semibold">
          {lPer100 !== null ? `${lPer100.toFixed(2)} L/100km` : "—"}
        </p>
        {lPer100 !== null && <p className="text-sm text-muted-foreground">{kmPerL?.toFixed(2)} km/L · {mpg?.toFixed(2)} MPG</p>}
        {(d <= 0 || f <= 0) && <p className="text-sm text-amber-600">{es ? "Distancia y combustible deben ser positivos" : "Distance and fuel must be positive"}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia" : "Distance"}</span>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad distancia" : "Distance unit"}</span>
          <select value={distUnit} onChange={(e) => setDistUnit(e.target.value as "km" | "mi")} className={fieldClass}>
            <option value="km">km</option>
            <option value="mi">miles</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Combustible usado" : "Fuel used"}</span>
          <input type="number" value={fuel} onChange={(e) => setFuel(e.target.value)} className={fieldClass} min="0" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad combustible" : "Fuel unit"}</span>
          <select value={fuelUnit} onChange={(e) => setFuelUnit(e.target.value as "L" | "gal")} className={fieldClass}>
            <option value="L">Liters</option>
            <option value="gal">Gallons</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={lPer100 === null}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: 100 km con 8 L → 8 L/100km (12.5 km/L)" : "Example 1: 100 km with 8 L → 8 L/100km (12.5 km/L)"}</p>
        <p>{es ? "Ejemplo 2: 300 mi con 10 gal → ~30 MPG" : "Example 2: 300 mi with 10 gal → ~30 MPG"}</p>
      </div>
    </div>
  );
}
