import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PxToRemCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [px, setPx] = useState("16");
  const [base, setBase] = useState("16");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(px);
    const b = parseFloat(base);
    if (!Number.isFinite(p) || p < 0 || p > 10000 || !Number.isFinite(b) || b <= 0 || b > 100) return null;
    const rem = Math.round((p / b) * 10000) / 10000;
    return { rem };
  }, [px, base]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `REM: ${result.rem}`
      : `REM: ${result.rem}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPx("16");
    setBase("16");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Valor en REM" : "Value in REM"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.rem} rem</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce valores válidos" : "Enter valid values"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Píxeles (px)" : "Pixels (px)"}</span>
        <input
          type="number"
          min="0"
          max="10000"
          step="1"
          value={px}
          onChange={(e) => setPx(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 16" : "e.g. 16"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Base (px, usualmente 16)" : "Base (px, usually 16)"}</span>
        <input
          type="number"
          min="1"
          max="100"
          step="1"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 16" : "e.g. 16"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Convierte píxeles a rem para CSS. Útil en diseño responsive."
          : "Converts pixels to rem for CSS. Useful for responsive design."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "16px con base 16 → 1 rem" : "16px with base 16 → 1 rem"}</p>
        <p>{es ? "24px con base 16 → 1.5 rem" : "24px with base 16 → 1.5 rem"}</p>
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
