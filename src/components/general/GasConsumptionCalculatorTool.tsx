import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function GasConsumptionCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [volume, setVolume] = useState("100");
  const [price, setPrice] = useState("1.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(volume);
    const p = parseFloat(price);
    if (isNaN(v) || v < 0 || v > 1e6 || isNaN(p) || p < 0 || p > 100) return null;
    const cost = v * p;
    return { cost: cost.toFixed(2) };
  }, [volume, price]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.cost);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setVolume("100");
    setPrice("1.5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Costo total" : "Total cost"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.cost}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Volumen y precio ≥ 0 requeridos" : "Volume and price ≥ 0 required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Volumen (m³ o L)" : "Volume (m³ or L)"}</span>
        <input type="number" step="any" min="0" value={volume} onChange={(e) => setVolume(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Precio por unidad" : "Price per unit"}</span>
        <input type="number" step="any" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: Costo = Volumen × Precio" : "Formula: Cost = Volume × Price"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 m³ × 1.5 → 150" : "100 m³ × 1.5 → 150"}</p>
        <p>{es ? "50 L × 2 → 100" : "50 L × 2 → 100"}</p>
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
