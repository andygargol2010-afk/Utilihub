import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const ACRES_TO_HA = 0.40468564224;
const HA_TO_ACRES = 1 / ACRES_TO_HA;

export function AcresHectaresConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<"acres" | "hectares">("acres");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (isNaN(n) || n < 0) return null;
    if (from === "acres") {
      return (n * ACRES_TO_HA).toFixed(6);
    } else {
      return (n * HA_TO_ACRES).toFixed(6);
    }
  }, [value, from]);

  const unit = from === "acres" ? (es ? "hectáreas" : "hectares") : (es ? "acres" : "acres");

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setValue("1"); setFrom("acres"); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result} {unit}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa un valor válido ≥ 0" : "Enter a valid value ≥ 0"}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" min={0} step="any" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as "acres" | "hectares")} className={fieldClass}>
            <option value="acres">{es ? "Acres" : "Acres"}</option>
            <option value="hectares">{es ? "Hectáreas" : "Hectares"}</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "1 acre = 0.404686 hectáreas. Útil para tierras, inmobiliaria y agricultura." : "1 acre = 0.404686 hectares. Useful for land, real estate and agriculture."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 acre → 0.404686 hectáreas" : "1 acre → 0.404686 hectares"}</p>
        <p>{es ? "2.5 hectáreas → 6.177635 acres" : "2.5 hectares → 6.177635 acres"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p><a href={es ? "/es/herramientas/conversor-millas-km" : "/tools/conversor-millas-km"} className="underline">{es ? "Conversor millas a km" : "Miles to km converter"}</a></p>
        <p><a href={es ? "/es/herramientas/calculadora-area-rectangular" : "/tools/calculadora-area-rectangular"} className="underline">{es ? "Calculadora de área rectangular" : "Rectangle area calculator"}</a></p>
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
