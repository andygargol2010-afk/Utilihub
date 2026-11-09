import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TrapezoidAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [baseA, setBaseA] = useState("8");
  const [baseB, setBaseB] = useState("12");
  const [height, setHeight] = useState("5");
  const [copied, setCopied] = useState(false);

  const area = useMemo(() => {
    const a = parseFloat(baseA);
    const b = parseFloat(baseB);
    const h = parseFloat(height);
    if (isNaN(a) || isNaN(b) || isNaN(h) || a <= 0 || b <= 0 || h <= 0) return null;
    return ((a + b) / 2) * h;
  }, [baseA, baseB, height]);

  async function copy() {
    if (area === null) return;
    const text = es
      ? `\u00c1rea del trapecio: ${area.toFixed(2)} (bases ${baseA} y ${baseB}, altura ${height})`
      : `Trapezoid area: ${area.toFixed(2)} (bases ${baseA} and ${baseB}, height ${height})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBaseA("8");
    setBaseB("12");
    setHeight("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "\u00c1rea del trapecio" : "Trapezoid area"}</p>
        {area !== null ? (
          <p className="text-2xl font-semibold font-mono">{area.toFixed(2)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Bases y altura deben ser > 0" : "Bases and height must be > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Base a" : "Base a"}</span>
        <input type="number" min="0.01" step="any" value={baseA} onChange={(e) => setBaseA(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Base b" : "Base b"}</span>
        <input type="number" min="0.01" step="any" value={baseB} onChange={(e) => setBaseB(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altura" : "Height"}</span>
        <input type="number" min="0.01" step="any" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "F\u00f3rmula: A = ((a + b) / 2) \u00d7 h. Unidades: mismas que las bases/altura." : "Formula: A = ((a + b) / 2) \u00d7 h. Units: same as bases/height."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Bases 6 y 10, altura 4 \u2192 \u00e1rea 32" : "Bases 6 and 10, height 4 \u2192 area 32"}</p>
        <p>{es ? "Bases 5 y 15, altura 3 \u2192 \u00e1rea 30" : "Bases 5 and 15, height 3 \u2192 area 30"}</p>
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
        {es ? "Relacionado: calculadora-area-rectangulo, calculadora-area-paralelogramo" : "Related: calculadora-area-rectangulo, calculadora-area-paralelogramo"}
      </p>
    </div>
  );
}
