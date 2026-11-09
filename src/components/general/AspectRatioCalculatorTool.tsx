import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function AspectRatioCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
    const d = gcd(w, h);
    const rw = Math.round(w / d);
    const rh = Math.round(h / d);
    const decimal = Math.round((w / h) * 1000) / 1000;
    return { ratio: `${rw}:${rh}`, decimal, simplified: rw !== w || rh !== h };
  }, [width, height]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Relación de aspecto: ${result.ratio} (${result.decimal}) para ${width}×${height}`
      : `Aspect ratio: ${result.ratio} (${result.decimal}) for ${width}×${height}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWidth("1920");
    setHeight("1080");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Relación de aspecto" : "Aspect ratio"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.ratio} <span className="text-lg text-muted-foreground">({result.decimal})</span></p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ancho y alto > 0" : "Width and height > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ancho" : "Width"}</span>
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className={fieldClass} placeholder="1920" min="0" step="any" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Alto" : "Height"}</span>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={fieldClass} placeholder="1080" min="0" step="any" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Simplifica la relación ancho:alto usando el máximo común divisor. Ideal para diseño, video y pantallas." : "Simplifies width:height ratio using the greatest common divisor. Ideal for design, video, and screens."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1920 × 1080 → 16:9 (1.778)" : "1920 × 1080 → 16:9 (1.778)"}</p>
        <p>{es ? "1080 × 1920 → 9:16 (0.563)" : "1080 × 1920 → 9:16 (0.563)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
