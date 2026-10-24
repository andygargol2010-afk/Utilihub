import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function YardsToMetersConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [yards, setYards] = useState("1");
  const [meters, setMeters] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const y = parseFloat(yards);
    if (!isNaN(y) && y >= 0 && y <= 100000) {
      const m = y * 0.9144;
      return { yards: y, meters: Math.round(m * 10000) / 10000 };
    }
    const m = parseFloat(meters);
    if (!isNaN(m) && m >= 0 && m <= 100000) {
      const y = m / 0.9144;
      return { yards: Math.round(y * 10000) / 10000, meters: m };
    }
    return null;
  }, [yards, meters]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.meters} m`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setYards("1");
    setMeters("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.meters} m</p>
            <p className="text-sm text-muted-foreground">{result.yards} {es ? "yardas" : "yards"}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un valor ≥ 0" : "Enter a value ≥ 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Yardas" : "Yards"}</span>
        <input
          type="number"
          step="any"
          min="0"
          value={yards}
          onChange={(e) => { setYards(e.target.value); setMeters(""); }}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Metros" : "Meters"}</span>
        <input
          type="number"
          step="any"
          min="0"
          value={meters}
          onChange={(e) => { setMeters(e.target.value); setYards(""); }}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "1 yarda = 0.9144 metros (yarda internacional)." : "1 yard = 0.9144 meters (international yard)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 yardas → 9.144 m" : "10 yards → 9.144 m"}</p>
        <p>{es ? "100 m → 109.361 yardas" : "100 m → 109.361 yards"}</p>
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
