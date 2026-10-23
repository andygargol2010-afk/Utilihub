import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MilesToKmConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [miles, setMiles] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(miles);
    if (isNaN(m) || m < 0 || m > 1e7) return null;
    const km = m * 1.609344;
    return { km: km.toFixed(4) };
  }, [miles]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.km);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMiles("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Millas a kil\u00f3metros" : "Miles to kilometers"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.km} km</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Millas \u2265 0 requeridas" : "Miles \u2265 0 required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Millas" : "Miles"}</span>
        <input type="number" step="any" min="0" value={miles} onChange={(e) => setMiles(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "1 milla = 1.609344 km" : "1 mile = 1.609344 km"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 milla \u2192 1.6093 km" : "1 mile \u2192 1.6093 km"}</p>
        <p>{es ? "5 millas \u2192 8.0467 km" : "5 miles \u2192 8.0467 km"}</p>
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
