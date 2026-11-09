import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const s = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ColorContrastCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#FFFFFF");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const f = hexToRgb(fg);
    const b = hexToRgb(bg);
    if (!f || !b) return null;
    const lf = relativeLuminance(f.r, f.g, f.b);
    const lb = relativeLuminance(b.r, b.g, b.b);
    const ratio = contrastRatio(lf, lb);
    const aa = ratio >= 4.5;
    const aaLarge = ratio >= 3;
    const aaa = ratio >= 7;
    return { ratio: Math.round(ratio * 100) / 100, aa, aaLarge, aaa };
  }, [fg, bg]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Contraste: ${result.ratio}:1 (AA: ${result.aa ? "sí" : "no"})`
      : `Contrast: ${result.ratio}:1 (AA: ${result.aa ? "yes" : "no"})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setFg("#000000");
    setBg("#FFFFFF");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Ratio de contraste" : "Contrast ratio"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.ratio}:1</p>
            <p className="text-sm">
              {es ? "AA normal:" : "AA normal:"} {result.aa ? (es ? "Pasa" : "Pass") : (es ? "Falla" : "Fail")} ·{" "}
              {es ? "AA grande:" : "AA large:"} {result.aaLarge ? (es ? "Pasa" : "Pass") : (es ? "Falla" : "Fail")} ·{" "}
              AAA: {result.aaa ? (es ? "Pasa" : "Pass") : (es ? "Falla" : "Fail")}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Hex inválido" : "Invalid hex"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Color texto (hex)" : "Text color (hex)"}</span>
          <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className={fieldClass} placeholder="#000000" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Color fondo (hex)" : "Background color (hex)"}</span>
          <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className={fieldClass} placeholder="#FFFFFF" />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "#000000 sobre #FFFFFF → 21:1 (AAA)" : "#000000 on #FFFFFF → 21:1 (AAA)"}</p>
        <p>{es ? "#767676 sobre #FFFFFF → ~4.54:1 (AA)" : "#767676 on #FFFFFF → ~4.54:1 (AA)"}</p>
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
