import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function HypotenuseCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [legA, setLegA] = useState("3");
  const [legB, setLegB] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(legA);
    const b = parseFloat(legB);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0 || Math.abs(a) > 1e9 || Math.abs(b) > 1e9) return null;
    const hyp = Math.hypot(a, b);
    return {
      hyp: Math.round(hyp * 1000) / 1000,
      a,
      b,
    };
  }, [legA, legB]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Catetos ${result.a} y ${result.b} → hipotenusa ${result.hyp}`
      : `Legs ${result.a} and ${result.b} → hypotenuse ${result.hyp}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLegA("3");
    setLegB("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Hipotenusa" : "Hypotenuse"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.hyp}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Catetos ${result.a} y ${result.b}` : `Legs ${result.a} and ${result.b}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce dos catetos > 0" : "Enter two legs > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Cateto A" : "Leg A"}</span>
        <input
          type="number"
          value={legA}
          onChange={(e) => setLegA(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 3" : "e.g. 3"}
          min="0"
          step="any"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Cateto B" : "Leg B"}</span>
        <input
          type="number"
          value={legB}
          onChange={(e) => setLegB(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 4" : "e.g. 4"}
          min="0"
          step="any"
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Hipotenusa = √(catetoA² + catetoB²). Solo para triángulos rectángulos (teorema de Pitágoras)."
          : "Hypotenuse = √(legA² + legB²). Only for right triangles (Pythagorean theorem)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Catetos 3 y 4 → 5" : "Legs 3 and 4 → 5"}</p>
        <p>{es ? "Catetos 5 y 12 → 13" : "Legs 5 and 12 → 13"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-area-triangulo" : "/calculadora-area-triangulo"} className="underline">
            {es ? "Calculadora de área de triángulo" : "Triangle area calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-circunferencia" : "/calculadora-circunferencia"} className="underline">
            {es ? "Calculadora de circunferencia" : "Circumference calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
