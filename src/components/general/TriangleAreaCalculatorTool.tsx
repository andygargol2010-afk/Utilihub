import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TriangleAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [base, setBase] = useState("10");
  const [height, setHeight] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const b = parseFloat(base);
    const h = parseFloat(height);
    if (!Number.isFinite(b) || !Number.isFinite(h) || b <= 0 || h <= 0 || Math.abs(b) > 1e9 || Math.abs(h) > 1e9) return null;
    const area = (b * h) / 2;
    return {
      area: Math.round(area * 10000) / 10000,
      base: b,
      height: h,
    };
  }, [base, height]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Base ${result.base}, altura ${result.height} → área ${result.area}`
      : `Base ${result.base}, height ${result.height} → area ${result.area}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBase("10");
    setHeight("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área del triángulo" : "Triangle area"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.area}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Base ${result.base} · Altura ${result.height}` : `Base ${result.base} · Height ${result.height}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce base y altura > 0" : "Enter base and height > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Base" : "Base"}</span>
        <input
          type="number"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 10" : "e.g. 10"}
          min="0"
          step="any"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altura" : "Height"}</span>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 5" : "e.g. 5"}
          min="0"
          step="any"
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Área = (base × altura) / 2. Útil para geometría, construcción y escuela."
          : "Area = (base × height) / 2. Useful for geometry, construction, and school."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Base 10, altura 5 → 25" : "Base 10, height 5 → 25"}</p>
        <p>{es ? "Base 6, altura 4 → 12" : "Base 6, height 4 → 12"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-area-rectangulo" : "/calculadora-area-rectangulo"} className="underline">
            {es ? "Calculadora de área de rectángulo" : "Rectangle area calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-circunferencia" : "/calculadora-circunferencia"} className="underline">
            {es ? "Calculadora de circunferencia" : "Circumference calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
