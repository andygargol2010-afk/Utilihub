import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const OZ_TO_G = 28.349523125;

export function OuncesToGramsConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [ounces, setOunces] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const oz = parseFloat(ounces);
    if (isNaN(oz) || oz < 0 || oz > 1e9) return null;
    const grams = oz * OZ_TO_G;
    return { grams: Number.isFinite(grams) ? grams.toFixed(2) : null };
  }, [ounces]);

  async function copy() {
    if (!result?.grams) return;
    try {
      await navigator.clipboard.writeText(result.grams);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setOunces("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Gramos" : "Grams"}</p>
        {result?.grams != null ? (
          <p className="text-3xl font-semibold">{result.grams} g</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresá un valor ≥ 0" : "Enter a value ≥ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Onzas" : "Ounces"}</span>
          <input type="number" min="0" step="any" value={ounces} onChange={(e) => setOunces(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "1 oz = 28.3495 g" : "1 oz = 28.3495 g"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 oz → 28.35 g" : "1 oz → 28.35 g"}</p>
        <p>{es ? "8 oz → 226.80 g" : "8 oz → 226.80 g"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result?.grams}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
