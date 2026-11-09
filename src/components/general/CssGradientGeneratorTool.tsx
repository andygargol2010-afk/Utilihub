import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CssGradientGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [angle, setAngle] = useState("90");
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#8b5cf6");
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const a = parseFloat(angle);
    const deg = isNaN(a) ? 90 : a;
    return `linear-gradient(${deg}deg, ${color1}, ${color2})`;
  }, [angle, color1, color2]);

  const fullCss = `background-image: ${css};`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullCss);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAngle("90");
    setColor1("#3b82f6");
    setColor2("#8b5cf6");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl border h-40 w-full"
        style={{ backgroundImage: css }}
        aria-hidden
      />

      <div className="rounded-2xl border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground mb-2">{es ? "CSS listo" : "Ready CSS"}</p>
        <code className="text-sm break-all">{fullCss}</code>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ángulo (°)" : "Angle (°)"}</span>
          <input type="number" min="0" max="360" step="1" value={angle} onChange={(e) => setAngle(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Color 1" : "Color 1"}</span>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-11 w-full rounded-xl border cursor-pointer" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Color 2" : "Color 2"}</span>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-11 w-full rounded-xl border cursor-pointer" />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "90° azul→violeta: linear-gradient(90deg, #3b82f6, #8b5cf6)" : "90° blue→purple: linear-gradient(90deg, #3b82f6, #8b5cf6)"}</p>
        <p>{es ? "180° rojo→naranja: linear-gradient(180deg, #ef4444, #f97316)" : "180° red→orange: linear-gradient(180deg, #ef4444, #f97316)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar CSS" : "Copy CSS"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
