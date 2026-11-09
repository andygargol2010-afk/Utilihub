import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function MetersToFeetConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [meters, setMeters] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(meters);
    if (isNaN(m) || m < 0 || m > 100000) return null;
    const feet = m * 3.280839895;
    const wholeFeet = Math.floor(feet);
    const inches = (feet - wholeFeet) * 12;
    return { feet: Math.round(feet * 100) / 100, wholeFeet, inches: Math.round(inches * 10) / 10 };
  }, [meters]);

  async function copy() {
    if (!result) return;
    const text = `${result.feet} ft`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setMeters("1"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado en pies" : "Result in feet"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.feet} ft</p>
            <p className="text-sm text-muted-foreground">{result.wholeFeet} ft {result.inches} in</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valor válido (0-100000 m) requerido" : "Valid value (0-100000 m) required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Metros" : "Meters"}</span>
        <input type="number" step="0.01" min="0" max="100000" value={meters} onChange={(e) => setMeters(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "1 metro = 3.28084 pies. Cálculo preciso en el navegador." : "1 meter = 3.28084 feet. Accurate calculation in the browser."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 m → 3.28 ft (3 ft 3.4 in)" : "1 m → 3.28 ft (3 ft 3.4 in)"}</p>
        <p>{es ? "10 m → 32.81 ft" : "10 m → 32.81 ft"}</p>
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
