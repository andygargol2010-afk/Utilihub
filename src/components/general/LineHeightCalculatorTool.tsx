import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function LineHeightCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [fontSize, setFontSize] = useState("16");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = Number(fontSize.trim());
    if (fontSize.trim() === "" || Number.isNaN(n)) {
      return { error: es ? "Introduce un tamaño de fuente válido" : "Enter a valid font size" };
    }
    if (n <= 0) {
      return { error: es ? "El tamaño debe ser positivo" : "Size must be positive" };
    }
    if (n < 8 || n > 200) {
      return { error: es ? "Tamaño fuera de rango razonable (8–200 px)" : "Size outside reasonable range (8–200 px)" };
    }
    const bodyRatio = 1.5;
    const headingRatio = 1.2;
    const bodyPx = Math.round(n * bodyRatio * 10) / 10;
    const headingPx = Math.round(n * headingRatio * 10) / 10;
    return { n, bodyRatio, headingRatio, bodyPx, headingPx };
  }, [fontSize, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Font-size ${result.n}px → body line-height ${result.bodyRatio} (${result.bodyPx}px); headings ${result.headingRatio} (${result.headingPx}px)`
      : `Font-size ${result.n}px → body line-height ${result.bodyRatio} (${result.bodyPx}px); headings ${result.headingRatio} (${result.headingPx}px)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setFontSize("16");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {es ? "Cuerpo" : "Body"}: {result.bodyRatio} ({result.bodyPx}px)
            </p>
            <p className="text-lg font-semibold">
              {es ? "Títulos" : "Headings"}: {result.headingRatio} ({result.headingPx}px)
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un tamaño en px" : "Enter a size in px"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tamaño de fuente (px)" : "Font size (px)"}</span>
          <input
            type="text"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className={fieldClass}
            placeholder="16"
            inputMode="decimal"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Altura de línea recomendada para legibilidad. Cuerpo de texto 1.5, títulos 1.2. El valor en px es orientativo."
          : "Recommended line-height for readability. Body text 1.5, headings 1.2. The px value is approximate."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "16 px → cuerpo 24 px (1.5), títulos 19.2 px (1.2)" : "16 px → body 24 px (1.5), headings 19.2 px (1.2)"}</p>
        <p>{es ? "18 px → cuerpo 27 px (1.5), títulos 21.6 px (1.2)" : "18 px → body 27 px (1.5), headings 21.6 px (1.2)"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-px-a-rem" : "/tools/calculadora-px-a-rem"} className="underline text-primary">
            {es ? "PX a REM" : "PX to REM"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/generador-css-clamp" : "/tools/generador-css-clamp"} className="underline text-primary">
            {es ? "Generador CSS clamp" : "CSS clamp generator"}
          </a>
        </p>
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
