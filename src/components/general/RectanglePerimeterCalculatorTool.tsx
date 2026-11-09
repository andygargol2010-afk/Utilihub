import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RectanglePerimeterCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (!Number.isFinite(l) || l <= 0 || l > 1000000 || !Number.isFinite(w) || w <= 0 || w > 1000000) return null;
    const perimeter = Math.round(2 * (l + w) * 100) / 100;
    return { perimeter };
  }, [length, width]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Perímetro: ${result.perimeter}`
      : `Perimeter: ${result.perimeter}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength("10");
    setWidth("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Perímetro del rectángulo" : "Rectangle perimeter"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{es ? `Perímetro: ${result.perimeter}` : `Perimeter: ${result.perimeter}`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce longitud y ancho válidos" : "Enter a valid length and width"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Longitud" : "Length"}</span>
        <input
          type="number"
          min="0.01"
          max="1000000"
          step="0.1"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 10" : "e.g. 10"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ancho" : "Width"}</span>
        <input
          type="number"
          min="0.01"
          max="1000000"
          step="0.1"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 5" : "e.g. 5"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula el perímetro P = 2 × (longitud + ancho). Útil para cercas, marcos, etc."
          : "Calculates the perimeter P = 2 × (length + width). Useful for fences, frames, etc."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Longitud 10, ancho 5 → Perímetro 30" : "Length 10, width 5 → Perimeter 30"}</p>
        <p>{es ? "Longitud 8.5, ancho 3.2 → Perímetro 23.4" : "Length 8.5, width 3.2 → Perimeter 23.4"}</p>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-area-rectangulo" : "/calculadora-area-rectangulo"} className="underline">
            {es ? "Calculadora de área de rectángulo" : "Rectangle area calculator"}
          </a>
        </p>
        <p>
          <a href={es ? "/es/calculadora-area-triangulo" : "/calculadora-area-triangulo"} className="underline">
            {es ? "Calculadora de área de triángulo" : "Triangle area calculator"}
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
