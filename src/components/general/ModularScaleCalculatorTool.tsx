import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ModularScaleCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [base, setBase] = useState("16");
  const [ratio, setRatio] = useState("1.25");
  const [steps, setSteps] = useState("4");
  const [copied, setCopied] = useState(false);

  const sizes = useMemo(() => {
    const b = parseFloat(base);
    const r = parseFloat(ratio);
    const s = parseInt(steps, 10);
    if (isNaN(b) || isNaN(r) || isNaN(s) || b <= 0 || r <= 1 || s < 0 || s > 12) return null;
    const result: number[] = [];
    for (let i = -s; i <= s; i++) {
      result.push(b * Math.pow(r, i));
    }
    return result;
  }, [base, ratio, steps]);

  async function copy() {
    if (!sizes) return;
    const text = es
      ? `Escala modular (base ${base}px, ratio ${ratio}): ${sizes.map(sz => sz.toFixed(2)).join(", ")} px`
      : `Modular scale (base ${base}px, ratio ${ratio}): ${sizes.map(sz => sz.toFixed(2)).join(", ")} px`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setBase("16");
    setRatio("1.25");
    setSteps("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Escala tipográfica modular" : "Modular type scale"}</p>
        {sizes ? (
          <ul className="space-y-1 text-sm">
            {sizes.map((sz, idx) => (
              <li key={idx} className="font-mono">
                {sz.toFixed(2)} px
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Base > 0, ratio > 1, pasos 0–12" : "Base > 0, ratio > 1, steps 0–12"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tamaño base (px)" : "Base size (px)"}</span>
        <input type="number" min="1" step="any" value={base} onChange={(e) => setBase(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ratio" : "Ratio"}</span>
        <input type="number" min="1.01" step="0.01" value={ratio} onChange={(e) => setRatio(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Pasos arriba/abajo" : "Steps up/down"}</span>
        <input type="number" min="0" max="12" step="1" value={steps} onChange={(e) => setSteps(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Cada paso: tamaño × ratio^paso. Ratio típicos: 1.25, 1.333, 1.5, 1.618." : "Each step: size × ratio^step. Common ratios: 1.25, 1.333, 1.5, 1.618."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Base 16, ratio 1.25, 2 pasos → ~10.24, 12.8, 16, 20, 25" : "Base 16, ratio 1.25, 2 steps → ~10.24, 12.8, 16, 20, 25"}</p>
        <p>{es ? "Base 18, ratio 1.5, 1 paso → 12, 18, 27" : "Base 18, ratio 1.5, 1 step → 12, 18, 27"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: calculadora-px-a-rem, calculadora-line-height" : "Related: calculadora-px-a-rem, calculadora-line-height"}
      </p>
    </div>
  );
}
