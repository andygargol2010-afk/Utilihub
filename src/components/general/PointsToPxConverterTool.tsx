import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const PT_PER_PX = 0.75; // 1 px = 0.75 pt; or 1 pt = 1.333 px

export function PointsToPxConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("12");
  const [fromPt, setFromPt] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (Number.isNaN(n) || !Number.isFinite(n) || n < 0) return null;
    const out = fromPt ? n * (4 / 3) : n * 0.75;
    return { input: n, output: out, fromPt };
  }, [value, fromPt]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${result.input} ${result.fromPt ? "pt" : "px"} = ${result.output.toFixed(3)} ${result.fromPt ? "px" : "pt"}`
      : `${result.input} ${result.fromPt ? "pt" : "px"} = ${result.output.toFixed(3)} ${result.fromPt ? "px" : "pt"}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("12");
    setFromPt(true);
    setCopied(false);
  }

  function swap() {
    setFromPt(!fromPt);
    if (result) setValue(result.output.toFixed(3));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor pt ↔ px" : "pt ↔ px converter"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.output.toFixed(3)} {result.fromPt ? "px" : "pt"}</p>
            <p className="text-sm text-muted-foreground">
              {result.input} {result.fromPt ? "pt" : "px"} → {result.output.toFixed(3)} {result.fromPt ? "px" : "pt"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un número positivo" : "Enter a positive number"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor" : "Value"}</span>
        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldClass}
          placeholder="12"
        />
      </label>

      <div className="flex items-center gap-2">
        <span className="text-sm">{fromPt ? "pt" : "px"}</span>
        <button type="button" className={buttonClass} onClick={swap}>
          {es ? "Invertir" : "Swap"}
        </button>
        <span className="text-sm">{fromPt ? "px" : "pt"}</span>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Convierte puntos tipográficos a píxeles CSS usando la referencia de 96 DPI (1 pt = 1.333 px)."
          : "Converts typographic points to CSS pixels using the 96 DPI reference (1 pt = 1.333 px)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "12 pt → 16 px" : "12 pt → 16 px"}</p>
        <p>{es ? "16 px → 12 pt" : "16 px → 12 pt"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-px-a-rem" : "/tools/calculadora-px-a-rem"} className="underline text-primary">
            {es ? "px a rem" : "px to rem"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-relacion-aspecto" : "/tools/calculadora-relacion-aspecto"} className="underline text-primary">
            {es ? "Relación de aspecto" : "Aspect ratio"}
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
