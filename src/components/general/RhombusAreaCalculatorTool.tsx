import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RhombusAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [d1, setD1] = useState("8");
  const [d2, setD2] = useState("6");
  const [copied, setCopied] = useState(false);

  const area = useMemo(() => {
    const a = parseFloat(d1);
    const b = parseFloat(d2);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return null;
    return (a * b) / 2;
  }, [d1, d2]);

  async function copy() {
    if (area === null) return;
    const text = es
      ? `\u00c1rea del rombo: ${area.toFixed(2)} (diagonales ${d1} y ${d2})`
      : `Rhombus area: ${area.toFixed(2)} (diagonals ${d1} and ${d2})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setD1("8");
    setD2("6");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "\u00c1rea del rombo" : "Rhombus area"}</p>
        {area !== null ? (
          <p className="text-2xl font-semibold font-mono">{area.toFixed(2)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Las diagonales deben ser > 0" : "Diagonals must be > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Diagonal 1" : "Diagonal 1"}</span>
        <input type="number" min="0.01" step="any" value={d1} onChange={(e) => setD1(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Diagonal 2" : "Diagonal 2"}</span>
        <input type="number" min="0.01" step="any" value={d2} onChange={(e) => setD2(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "F\u00f3rmula: A = (d1 \u00d7 d2) / 2. Unidades: mismas que las diagonales." : "Formula: A = (d1 \u00d7 d2) / 2. Units: same as diagonals."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Diagonales 10 y 8 \u2192 \u00e1rea 40" : "Diagonals 10 and 8 \u2192 area 40"}</p>
        <p>{es ? "Diagonales 6 y 4 \u2192 \u00e1rea 12" : "Diagonals 6 and 4 \u2192 area 12"}</p>
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
        {es ? "Relacionado: calculadora-area-paralelogramo, calculadora-area-trapecio" : "Related: calculadora-area-paralelogramo, calculadora-area-trapecio"}
      </p>
    </div>
  );
}
