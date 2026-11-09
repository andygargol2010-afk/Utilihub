import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ParallelogramAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [base, setBase] = useState("5");
  const [height, setHeight] = useState("3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const b = parseFloat(base);
    const h = parseFloat(height);
    if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) return null;
    return b * h;
  }, [base, height]);

  async function copy() {
    if (result === null) return;
    const text = es
      ? `Área del paralelogramo: ${result} (base ${base} × altura ${height})`
      : `Parallelogram area: ${result} (base ${base} × height ${height})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBase("5");
    setHeight("3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área del paralelogramo" : "Parallelogram area"}</p>
        {result !== null ? (
          <p className="text-3xl font-semibold">{result.toFixed(2)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce base y altura positivas" : "Enter positive base and height"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Base" : "Base"}</span>
        <input type="number" min="0" step="any" value={base} onChange={(e) => setBase(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altura" : "Height"}</span>
        <input type="number" min="0" step="any" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Área = base × altura (altura perpendicular a la base)." : "Area = base × height (perpendicular height)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Base 5, altura 3 → 15" : "Base 5, height 3 → 15"}</p>
        <p>{es ? "Base 10, altura 4.5 → 45" : "Base 10, height 4.5 → 45"}</p>
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
        {es ? "Relacionado: calculadora-area-rectangulo, calculadora-area-triangulo" : "Related: calculadora-area-rectangulo, calculadora-area-triangulo"}
      </p>
    </div>
  );
}
