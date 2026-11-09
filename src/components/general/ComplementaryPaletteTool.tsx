import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function complementary(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
}

export function ComplementaryPaletteTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [hex, setHex] = useState("#2563eb");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => complementary(hex), [hex]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHex("#2563eb");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Paleta complementaria" : "Complementary palette"}</p>
        {result ? (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg border" style={{ backgroundColor: hex }} />
            <div className="h-12 w-12 rounded-lg border" style={{ backgroundColor: result }} />
            <p className="text-xl font-semibold">{result}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "HEX válido requerido (ej. #2563eb)" : "Valid HEX required (e.g. #2563eb)"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Color base (HEX)" : "Base color (HEX)"}</span>
        <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className={fieldClass} placeholder="#2563eb" />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "#2563eb → #d99c14" : "#2563eb → #d99c14"}</p>
        <p>{es ? "#ef4444 → #10bbbb" : "#ef4444 → #10bbbb"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar complementario" : "Copy complementary"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
