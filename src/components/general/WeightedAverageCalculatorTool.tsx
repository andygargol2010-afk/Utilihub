import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WeightedAverageCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [v1, setV1] = useState("85");
  const [w1, setW1] = useState("0.3");
  const [v2, setV2] = useState("90");
  const [w2, setW2] = useState("0.4");
  const [v3, setV3] = useState("78");
  const [w3, setW3] = useState("0.2");
  const [v4, setV4] = useState("92");
  const [w4, setW4] = useState("0.1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const pairs = [
      { v: parseFloat(v1), w: parseFloat(w1) },
      { v: parseFloat(v2), w: parseFloat(w2) },
      { v: parseFloat(v3), w: parseFloat(w3) },
      { v: parseFloat(v4), w: parseFloat(w4) },
    ].filter((p) => !isNaN(p.v) && !isNaN(p.w) && p.w > 0);
    if (pairs.length === 0) return null;
    const sumVW = pairs.reduce((acc, p) => acc + p.v * p.w, 0);
    const sumW = pairs.reduce((acc, p) => acc + p.w, 0);
    if (sumW === 0) return null;
    const avg = sumVW / sumW;
    return { avg: Math.round(avg * 10000) / 10000 };
  }, [v1, w1, v2, w2, v3, w3, v4, w4]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Promedio ponderado: ${result.avg}` : `Weighted average: ${result.avg}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setV1("85"); setW1("0.3");
    setV2("90"); setW2("0.4");
    setV3("78"); setW3("0.2");
    setV4("92"); setW4("0.1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Promedio ponderado" : "Weighted average"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.avg}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce al menos un valor con peso > 0" : "Enter at least one value with weight > 0"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor 1" : "Value 1"}</span>
          <input type="number" step="any" value={v1} onChange={(e) => setV1(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso 1" : "Weight 1"}</span>
          <input type="number" step="any" min="0" value={w1} onChange={(e) => setW1(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor 2" : "Value 2"}</span>
          <input type="number" step="any" value={v2} onChange={(e) => setV2(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso 2" : "Weight 2"}</span>
          <input type="number" step="any" min="0" value={w2} onChange={(e) => setW2(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor 3" : "Value 3"}</span>
          <input type="number" step="any" value={v3} onChange={(e) => setV3(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso 3" : "Weight 3"}</span>
          <input type="number" step="any" min="0" value={w3} onChange={(e) => setW3(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor 4" : "Value 4"}</span>
          <input type="number" step="any" value={v4} onChange={(e) => setV4(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso 4" : "Weight 4"}</span>
          <input type="number" step="any" min="0" value={w4} onChange={(e) => setW4(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "85×0.3 + 90×0.4 + 78×0.2 + 92×0.1 → 86.3" : "85×0.3 + 90×0.4 + 78×0.2 + 92×0.1 → 86.3"}</p>
        <p>{es ? "10×2 + 20×3 → 16" : "10×2 + 20×3 → 16"}</p>
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
