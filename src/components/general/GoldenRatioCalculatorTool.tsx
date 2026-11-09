import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";
const PHI = 1.618033988749895;

export function GoldenRatioCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState("100");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const L = parseFloat(length);
    if (isNaN(L) || L <= 0 || L > 1e6) return null;
    const major = L * PHI;
    const minor = L / PHI;
    return {
      major: major.toFixed(2),
      minor: minor.toFixed(2),
      ratio: PHI.toFixed(5),
    };
  }, [length]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.major} / ${result.minor}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength("100");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Segmentos áureos" : "Golden segments"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.major} : {result.minor}</p>
            <p className="text-sm text-muted-foreground">{es ? `Ratio φ ≈ ${result.ratio}` : `Ratio φ ≈ ${result.ratio}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Longitud válida requerida (>0)" : "Valid length required (>0)"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Longitud base" : "Base length"}</span>
        <input type="number" step="any" min="0" value={length} onChange={(e) => setLength(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: mayor = L × φ, menor = L / φ, φ ≈ 1.618" : "Formula: major = L × φ, minor = L / φ, φ ≈ 1.618"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 → mayor 161.80, menor 61.80" : "100 → major 161.80, minor 61.80"}</p>
        <p>{es ? "200 → mayor 323.61, menor 123.61" : "200 → major 323.61, minor 123.61"}</p>
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
