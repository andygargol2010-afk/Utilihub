import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function KgToLbsConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("1");
  const [fromKg, setFromKg] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0 || v > 1e9) return null;
    const converted = fromKg ? v * 2.20462262185 : v / 2.20462262185;
    return { converted: Number.isFinite(converted) ? converted.toFixed(4) : null };
  }, [value, fromKg]);

  async function copy() {
    if (!result?.converted) return;
    try {
      await navigator.clipboard.writeText(result.converted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("1");
    setFromKg(true);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result?.converted != null ? (
          <p className="text-3xl font-semibold">{result.converted} {fromKg ? "lbs" : "kg"}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valor válido requerido (≥ 0)" : "Valid value required (≥ 0)"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={fromKg ? "kg" : "lbs"} onChange={(e) => setFromKg(e.target.value === "kg")} className={fieldClass}>
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "1 kg = 2.2046 lbs" : "1 kg = 2.2046 lbs"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>1 kg → 2.2046 lbs</p>
        <p>10 kg → 22.0462 lbs</p>
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
