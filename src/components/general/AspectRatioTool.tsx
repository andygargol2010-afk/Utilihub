import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function AspectRatioTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [ratioW, setRatioW] = useState("16");
  const [ratioH, setRatioH] = useState("9");
  const [mode, setMode] = useState<"fromDims" | "fromRatio">("fromDims");

  const result = useMemo(() => {
    const width = parseFloat(w);
    const height = parseFloat(h);
    const rw = parseFloat(ratioW);
    const rh = parseFloat(ratioH);
    if (mode === "fromDims") {
      if (!(width > 0 && height > 0)) return null;
      const g = gcd(width, height);
      return { ratio: `${width / g}:${height / g}`, decimal: (width / height).toFixed(3), width, height };
    } else {
      if (!(rw > 0 && rh > 0)) return null;
      if (width > 0) {
        const newH = (width * rh) / rw;
        return { ratio: `${rw}:${rh}`, width, height: Math.round(newH * 100) / 100 };
      }
      if (height > 0) {
        const newW = (height * rw) / rh;
        return { ratio: `${rw}:${rh}`, width: Math.round(newW * 100) / 100, height };
      }
      return null;
    }
  }, [w, h, ratioW, ratioH, mode]);

  function reset() {
    setW("1920");
    setH("1080");
    setRatioW("16");
    setRatioH("9");
    setMode("fromDims");
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${mode === "fromDims" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("fromDims")}>
          {es ? "Desde dimensiones" : "From dimensions"}
        </button>
        <button type="button" className={`${buttonClass} ${mode === "fromRatio" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("fromRatio")}>
          {es ? "Desde ratio" : "From ratio"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho" : "Width"}</span>
          <input value={w} onChange={(e) => setW(e.target.value)} className={fieldClass} inputMode="decimal" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Alto" : "Height"}</span>
          <input value={h} onChange={(e) => setH(e.target.value)} className={fieldClass} inputMode="decimal" />
        </label>
      </div>

      {mode === "fromRatio" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{es ? "Ratio ancho" : "Ratio width"}</span>
            <input value={ratioW} onChange={(e) => setRatioW(e.target.value)} className={fieldClass} inputMode="decimal" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{es ? "Ratio alto" : "Ratio height"}</span>
            <input value={ratioH} onChange={(e) => setRatioH(e.target.value)} className={fieldClass} inputMode="decimal" />
          </label>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
          <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
          <p className="text-2xl font-semibold">{result.ratio}</p>
          {mode === "fromDims" && <p className="font-mono text-sm">{es ? "Decimal" : "Decimal"}: {result.decimal}</p>}
          <p className="font-mono text-sm">{es ? "Ancho" : "Width"}: {result.width}</p>
          <p className="font-mono text-sm">{es ? "Alto" : "Height"}: {result.height}</p>
        </div>
      )}

      <button type="button" className={buttonClass} onClick={reset}>
        {es ? "Reiniciar" : "Reset"}
      </button>
    </div>
  );
}
