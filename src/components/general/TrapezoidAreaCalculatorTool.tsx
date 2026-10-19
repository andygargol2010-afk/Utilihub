import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TrapezoidAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [baseA, setBaseA] = useState("10");
  const [baseB, setBaseB] = useState("6");
  const [height, setHeight] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(baseA);
    const b = parseFloat(baseB);
    const h = parseFloat(height);
    if (isNaN(a) || isNaN(b) || isNaN(h) || a <= 0 || b <= 0 || h <= 0) return null;
    const area = ((a + b) / 2) * h;
    return { area: Math.round(area * 100) / 100 };
  }, [baseA, baseB, height]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Área: ${result.area}` : `Area: ${result.area}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBaseA("10");
    setBaseB("6");
    setHeight("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área del trapecio" : "Trapezoid area"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.area}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos > 0" : "Enter valid values > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Base a" : "Base a"}</span>
          <input type="number" step="any" min="0" value={baseA} onChange={(e) => setBaseA(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Base b" : "Base b"}</span>
          <input type="number" step="any" min="0" value={baseB} onChange={(e) => setBaseB(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" step="any" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Bases 10 y 6, altura 4 → 32" : "Bases 10 and 6, height 4 → 32"}</p>
        <p>{es ? "Bases 8 y 4, altura 5 → 30" : "Bases 8 and 4, height 5 → 30"}</p>
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
