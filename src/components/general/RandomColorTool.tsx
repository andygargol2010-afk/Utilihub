import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function randomHex(): string {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0");
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export function RandomColorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [color, setColor] = useState(randomHex);
  const [copied, setCopied] = useState<"hex" | "rgb" | null>(null);

  const rgb = hexToRgb(color);

  function generate() {
    setColor(randomHex());
    setCopied(null);
  }

  async function copy(text: string, which: "hex" | "rgb") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  function reset() {
    setColor("#000000");
    setCopied(null);
  }

  return (
    <div className="space-y-6">
      <div
        className="mx-auto h-40 w-full max-w-xs rounded-2xl border shadow-sm"
        style={{ backgroundColor: color }}
        aria-label={es ? "Muestra de color" : "Color swatch"}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">HEX</span>
          <input className={fieldClass} value={color} readOnly />
          <button type="button" className={buttonClass} onClick={() => copy(color, "hex")}>
            {copied === "hex" ? (es ? "Copiado" : "Copied") : es ? "Copiar HEX" : "Copy HEX"}
          </button>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">RGB</span>
          <input className={fieldClass} value={rgb} readOnly />
          <button type="button" className={buttonClass} onClick={() => copy(rgb, "rgb")}>
            {copied === "rgb" ? (es ? "Copiado" : "Copied") : es ? "Copiar RGB" : "Copy RGB"}
          </button>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={generate}>
          {es ? "Generar color" : "Generate color"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
