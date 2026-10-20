import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RhombusAreaCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [d1, setD1] = useState("8");
  const [d2, setD2] = useState("6");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(d1);
    const b = parseFloat(d2);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return null;
    const area = (a * b) / 2;
    return { area: Math.round(area * 100) / 100 };
  }, [d1, d2]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Área: ${result.area}` : `Area: ${result.area}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setD1("8");
    setD2("6");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Área del rombo" : "Rhombus area"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.area}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce diagonales > 0" : "Enter diagonals > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Diagonal 1" : "Diagonal 1"}</span>
          <input type="number" step="any" min="0" value={d1} onChange={(e) => setD1(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Diagonal 2" : "Diagonal 2"}</span>
          <input type="number" step="any" min="0" value={d2} onChange={(e) => setD2(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Diagonales 8 y 6 → 24" : "Diagonals 8 and 6 → 24"}</p>
        <p>{es ? "Diagonales 10 y 5 → 25" : "Diagonals 10 and 5 → 25"}</p>
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
