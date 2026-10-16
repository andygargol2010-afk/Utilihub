import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RoomAreaTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return null;
    const area = l * w;
    return { area: Math.round(area * 100) / 100, length: l, width: w };
  }, [length, width]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Área: ${result.area} m² (${result.length} × ${result.width})`
      : `Area: ${result.area} sq units (${result.length} × ${result.width})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength("5");
    setWidth("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área de la habitación" : "Room area"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.area} {es ? "m²" : "sq units"}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.length} × ${result.width}`
                : `${result.length} × ${result.width}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Dimensiones inválidas" : "Invalid dimensions"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Largo" : "Length"}</span>
          <input type="number" min="0.1" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ancho" : "Width"}</span>
          <input type="number" min="0.1" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "5 m × 4 m = 20 m²" : "5 × 4 = 20 sq units"}</p>
        <p>{es ? "3.5 m × 2.8 m = 9.8 m²" : "3.5 × 2.8 = 9.8 sq units"}</p>
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
