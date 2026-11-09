import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function EllipseAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("5");
  const [b, setB] = useState("3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const aa = parseFloat(a);
    const bb = parseFloat(b);
    if (isNaN(aa) || isNaN(bb) || aa <= 0 || bb <= 0) return null;
    const area = Math.PI * aa * bb;
    return { area: Math.round(area * 100) / 100, a: aa, b: bb };
  }, [a, b]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Área elipse: ${result.area} (semiejes ${result.a} × ${result.b})`
      : `Ellipse area: ${result.area} (semi-axes ${result.a} × ${result.b})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setA("5");
    setB("3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área de la elipse" : "Ellipse area"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.area}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Semiejes > 0" : "Semi-axes > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Semieje mayor (a)" : "Semi-major axis (a)"}</span>
          <input type="number" step="any" min="0" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Semieje menor (b)" : "Semi-minor axis (b)"}</span>
          <input type="number" step="any" min="0" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "a=5, b=3 → 47.12" : "a=5, b=3 → 47.12"}</p>
        <p>{es ? "a=10, b=4 → 125.66" : "a=10, b=4 → 125.66"}</p>
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
