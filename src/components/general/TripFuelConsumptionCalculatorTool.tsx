import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function TripFuelConsumptionCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [distance, setDistance] = useState("200");
  const [consumption, setConsumption] = useState("7.5");
  const [price, setPrice] = useState("1.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(distance.replace(",", "."));
    const c = parseFloat(consumption.replace(",", "."));
    const p = parseFloat(price.replace(",", "."));
    if (isNaN(d) || isNaN(c) || isNaN(p) || d < 0 || d > 20000 || c < 0 || c > 50 || p < 0 || p > 50) return null;
    const liters = (d / 100) * c;
    const cost = liters * p;
    return { liters: round2(liters), cost: round2(cost), d, c, p };
  }, [distance, consumption, price]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Viaje ${result.d} km @ ${result.c} L/100km → ${result.liters} L; costo ${result.cost}`
      : `Trip ${result.d} km @ ${result.c} L/100km → ${result.liters} L; cost ${result.cost}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("200");
    setConsumption("7.5");
    setPrice("1.5");
    setCopied(false);
  }

  function preset(km: string, l100: string) {
    setDistance(km);
    setConsumption(l100);
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-4">
        <div className="rounded-xl border bg-muted/30 p-4 space-y-1">
          <p className="text-sm text-muted-foreground">{es ? "Litros y costo estimado" : "Estimated liters and cost"}</p>
          {result ? (
            <>
              <p className="text-3xl font-semibold tabular-nums">{result.liters} L</p>
              <p className="text-lg font-medium tabular-nums">
                {es ? "Costo" : "Cost"}: {result.cost}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {es
                ? "Usá distancia ≥ 0, consumo 0–50 L/100 km y precio ≥ 0."
                : "Use distance ≥ 0, consumption 0–50 L/100 km, and price ≥ 0."}
            </p>
          )}
        </div>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia (km)" : "Distance (km)"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className={fieldClass}
            inputMode="decimal"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Consumo (L/100 km)" : "Consumption (L/100 km)"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
            className={fieldClass}
            inputMode="decimal"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Precio por litro" : "Price per liter"}</span>
          <input
            type="number"
            step="any"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={fieldClass}
            inputMode="decimal"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} onClick={() => preset("100", "6")}>
            100 km · 6 L
          </button>
          <button type="button" className={buttonClass} onClick={() => preset("200", "7.5")}>
            200 km · 7.5 L
          </button>
          <button type="button" className={buttonClass} onClick={() => preset("500", "8")}>
            500 km · 8 L
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {es
            ? "Fórmula: litros = (distancia ÷ 100) × consumo; costo = litros × precio."
            : "Formula: liters = (distance ÷ 100) × consumption; cost = liters × price."}
        </p>

        <div className="overflow-x-auto rounded-xl border text-sm">
          <table className="w-full text-left">
            <caption className="border-b bg-muted/30 px-3 py-2 text-left font-medium">
              {es ? "Ejemplos" : "Examples"}
            </caption>
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="px-3 py-2">km</th>
                <th className="px-3 py-2">L/100</th>
                <th className="px-3 py-2">{es ? "Precio" : "Price"}</th>
                <th className="px-3 py-2">{es ? "Litros" : "Liters"}</th>
                <th className="px-3 py-2">{es ? "Costo" : "Cost"}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60">
                <td className="px-3 py-2 tabular-nums">200</td>
                <td className="px-3 py-2 tabular-nums">7.5</td>
                <td className="px-3 py-2 tabular-nums">1.50</td>
                <td className="px-3 py-2 tabular-nums">15</td>
                <td className="px-3 py-2 tabular-nums">22.50</td>
              </tr>
              <tr>
                <td className="px-3 py-2 tabular-nums">100</td>
                <td className="px-3 py-2 tabular-nums">6</td>
                <td className="px-3 py-2 tabular-nums">1.80</td>
                <td className="px-3 py-2 tabular-nums">6</td>
                <td className="px-3 py-2 tabular-nums">10.80</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
          </button>
          <button type="button" className={buttonClass} onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {es ? "Relacionadas: " : "Related: "}
          <a className="underline" href={es ? "/es/herramientas/coste-km-viaje" : "/tools/coste-km-viaje"}>
            {es ? "Costo por km" : "Cost per km"}
          </a>
          {" · "}
          <a className="underline" href={es ? "/es/herramientas/combustible-necesario" : "/tools/combustible-necesario"}>
            {es ? "Combustible necesario" : "Fuel needed"}
          </a>
        </p>
      </div>
    </div>
  );
}
