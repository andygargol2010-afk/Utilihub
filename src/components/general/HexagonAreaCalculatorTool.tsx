import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function HexagonAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [side, setSide] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = parseFloat(side);
    if (isNaN(s) || s <= 0) return null;
    const area = (3 * Math.sqrt(3) / 2) * s * s;
    return { area: Math.round(area * 100) / 100, side: s };
  }, [side]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Área hexágono: ${result.area} (lado ${result.side})`
      : `Hexagon area: ${result.area} (side ${result.side})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSide("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área del hexágono regular" : "Regular hexagon area"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.area}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Lado > 0" : "Side > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Lado (s)" : "Side length (s)"}</span>
          <input type="number" step="any" min="0" value={side} onChange={(e) => setSide(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "lado=5 → 64.95" : "side=5 → 64.95"}</p>
        <p>{es ? "lado=10 → 259.81" : "side=10 → 259.81"}</p>
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
