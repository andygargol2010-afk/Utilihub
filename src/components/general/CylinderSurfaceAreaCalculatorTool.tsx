import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CylinderSurfaceAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [radius, setRadius] = useState("5");
  const [height, setHeight] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(radius);
    const h = parseFloat(height);
    if (Number.isNaN(r) || Number.isNaN(h) || !Number.isFinite(r) || !Number.isFinite(h)) return null;
    if (r <= 0 || h <= 0) return { error: es ? "Radio y altura deben ser > 0" : "Radius and height must be > 0" };
    if (r > 10000 || h > 10000) return { error: es ? "Valores fuera de rango razonable" : "Values outside reasonable range" };
    const area = 2 * Math.PI * r * (h + r);
    return { area, r, h };
  }, [radius, height, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `\u00c1rea total: ${result.area.toFixed(2)}`
      : `Total area: ${result.area.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRadius("5");
    setHeight("10");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "\u00c1rea total de superficie" : "Total surface area"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.area.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              2\u03c0 \u00d7 {result.r} \u00d7 ({result.h} + {result.r})
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores v\u00e1lidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Radio" : "Radius"}</span>
          <input type="number" min="0" step="any" value={radius} onChange={(e) => setRadius(e.target.value)} className={fieldClass} placeholder="5" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura" : "Height"}</span>
          <input type="number" min="0" step="any" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} placeholder="10" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Cilindro cerrado: \u00e1rea lateral 2\u03c0rh + dos bases 2\u03c0r\u00b2. Total: 2\u03c0r(h + r)."
          : "Closed cylinder: lateral area 2\u03c0rh + two bases 2\u03c0r\u00b2. Total: 2\u03c0r(h + r)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Radio 5, altura 10 \u2192 \u2248 471,24" : "Radius 5, height 10 \u2192 \u2248 471.24"}</p>
        <p>{es ? "Radio 2, altura 5 \u2192 \u2248 87,96" : "Radius 2, height 5 \u2192 \u2248 87.96"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-volumen-cilindro" : "/tools/calculadora-volumen-cilindro"} className="underline text-primary">
            {es ? "Volumen de cilindro" : "Cylinder volume"}
          </a>
          {" \u00b7 "}
          <a href={es ? "/es/herramientas/calculadora-area-superficie-esfera" : "/tools/calculadora-area-superficie-esfera"} className="underline text-primary">
            {es ? "\u00c1rea de superficie de esfera" : "Sphere surface area"}
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
