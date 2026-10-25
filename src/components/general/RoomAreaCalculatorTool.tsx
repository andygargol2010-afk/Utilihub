import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "m" | "ft";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RoomAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(5);
  const [unit, setUnit] = useState<Unit>("m");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (length <= 0 || width <= 0) return null;
    return length * width;
  }, [length, width]);

  async function copy() {
    if (result == null) return;
    const text = `${result.toFixed(2)} ${unit === "m" ? "m²" : "ft²"}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength(4);
    setWidth(5);
    setUnit("m");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área de la habitación" : "Room area"}</p>
        {result != null ? (
          <p className="text-3xl font-semibold">
            {result.toFixed(2)} {unit === "m" ? "m²" : "ft²"}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce largo y ancho positivos" : "Enter positive length and width"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">{es ? "Largo" : "Length"}</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value) || 0)}
            className={fieldClass}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho" : "Width"}</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value) || 0)}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Unidad" : "Unit"}</span>
        <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={fieldClass}>
          <option value="m">{es ? "Metros" : "Meters"}</option>
          <option value="ft">{es ? "Pies" : "Feet"}</option>
        </select>
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "4 m × 5 m → 20 m²" : "4 m × 5 m → 20 m²"}</p>
        <p>{es ? "10 ft × 12 ft → 120 ft²" : "10 ft × 12 ft → 120 ft²"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar área" : "Copy area"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
