import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TrianglePerimeterCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("5");
  const [b, setB] = useState("5");
  const [c, setC] = useState("6");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const aa = parseFloat(a), bb = parseFloat(b), cc = parseFloat(c);
    if ([aa, bb, cc].some(x => isNaN(x) || x <= 0 || x > 1e6)) return null;
    if (aa + bb <= cc || aa + cc <= bb || bb + cc <= aa) return null;
    return { perimeter: (aa + bb + cc).toFixed(4) };
  }, [a, b, c]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.perimeter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setA("5"); setB("5"); setC("6"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Perímetro del triángulo" : "Triangle perimeter"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.perimeter}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Lados > 0 que formen triángulo válido" : "Sides > 0 that form a valid triangle"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Lado a" : "Side a"}</span>
        <input type="number" step="any" min="0" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Lado b" : "Side b"}</span>
        <input type="number" step="any" min="0" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Lado c" : "Side c"}</span>
        <input type="number" step="any" min="0" value={c} onChange={(e) => setC(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Fórmula: Perímetro = a + b + c (desigualdad triangular)" : "Formula: Perimeter = a + b + c (triangle inequality)"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "5, 5, 6 → 16" : "5, 5, 6 → 16"}</p>
        <p>{es ? "3, 4, 5 → 12" : "3, 4, 5 → 12"}</p>
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
