import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const n = parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return "#" + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function HexColorConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [hex, setHex] = useState("#3B82F6");
  const [copied, setCopied] = useState("");

  const derived = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { rgb, hsl, hexOut: rgbToHex(rgb.r, rgb.g, rgb.b) };
  }, [hex]);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  }

  function reset() {
    setHex("#3B82F6");
    setCopied("");
  }

  const rgbStr = derived ? `rgb(${derived.rgb.r}, ${derived.rgb.g}, ${derived.rgb.b})` : "";
  const hslStr = derived ? `hsl(${derived.hsl.h}, ${derived.hsl.s}%, ${derived.hsl.l}%)` : "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl border" style={{ background: derived ? hex : "#ccc" }} />
          <div>
            <p className="text-sm text-muted-foreground">{es ? "Color" : "Color"}</p>
            <p className="font-mono text-lg">{derived ? hex.toUpperCase() : (es ? "HEX inválido" : "Invalid HEX")}</p>
          </div>
        </div>
        {derived && (
          <>
            <p className="font-mono text-sm">{rgbStr}</p>
            <p className="font-mono text-sm">{hslStr}</p>
          </>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Color HEX" : "HEX color"}</span>
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#3B82F6"
          className={fieldClass}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={() => copy(hex.toUpperCase(), "hex")} disabled={!derived}>
          {copied === "hex" ? (es ? "Copiado" : "Copied") : es ? "Copiar HEX" : "Copy HEX"}
        </button>
        <button type="button" className={buttonClass} onClick={() => copy(rgbStr, "rgb")} disabled={!derived}>
          {copied === "rgb" ? (es ? "Copiado" : "Copied") : es ? "Copiar RGB" : "Copy RGB"}
        </button>
        <button type="button" className={buttonClass} onClick={() => copy(hslStr, "hsl")} disabled={!derived}>
          {copied === "hsl" ? (es ? "Copiado" : "Copied") : es ? "Copiar HSL" : "Copy HSL"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
