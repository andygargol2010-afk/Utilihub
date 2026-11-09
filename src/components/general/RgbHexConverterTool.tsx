import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RgbHexConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [r, setR] = useState("255");
  const [g, setG] = useState("128");
  const [b, setB] = useState("0");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rr = parseInt(r, 10);
    const gg = parseInt(g, 10);
    const bb = parseInt(b, 10);
    if (isNaN(rr) || isNaN(gg) || isNaN(bb) || rr < 0 || rr > 255 || gg < 0 || gg > 255 || bb < 0 || bb > 255) return null;
    const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
    return `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`;
  }, [r, g, b]);

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
    setR("255");
    setG("128");
    setB("0");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "HEX" : "HEX"}</p>
        {result ? (
          <p className="text-3xl font-semibold font-mono">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "RGB válido (0-255)" : "Valid RGB (0-255)"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">R</span>
          <input type="number" min="0" max="255" value={r} onChange={(e) => setR(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">G</span>
          <input type="number" min="0" max="255" value={g} onChange={(e) => setG(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">B</span>
          <input type="number" min="0" max="255" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>255, 0, 0 → #FF0000</p>
        <p>0, 128, 255 → #0080FF</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar HEX" : "Copy HEX"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
