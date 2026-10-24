import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function InchesToCmConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (isNaN(n) || n < 0 || n > 1e6) return null;
    const cm = n * 2.54;
    return { cm: Math.round(cm * 1e4) / 1e4 };
  }, [value]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.cm}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Centímetros" : "Centimeters"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.cm} cm</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce pulgadas ≥ 0" : "Enter inches ≥ 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Pulgadas" : "Inches"}</span>
        <input
          type="number"
          step="any"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "1 pulgada = 2.54 cm. Conversión exacta estándar."
          : "1 inch = 2.54 cm. Standard exact conversion."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 in → 2.54 cm" : "1 in → 2.54 cm"}</p>
        <p>{es ? "12 in → 30.48 cm" : "12 in → 30.48 cm"}</p>
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
