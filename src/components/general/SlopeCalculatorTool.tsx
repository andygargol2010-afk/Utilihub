import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SlopeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [x1, setX1] = useState("0");
  const [y1, setY1] = useState("0");
  const [x2, setX2] = useState("2");
  const [y2, setY2] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(x1);
    const b = parseFloat(y1);
    const c = parseFloat(x2);
    const d = parseFloat(y2);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || Math.abs(a) > 1e6 || Math.abs(b) > 1e6 || Math.abs(c) > 1e6 || Math.abs(d) > 1e6) return null;
    const dx = c - a;
    if (dx === 0) return { m: "undefined", rise: (d - b).toFixed(2), run: "0" };
    const m = (d - b) / dx;
    return { m: m.toFixed(4), rise: (d - b).toFixed(2), run: dx.toFixed(2) };
  }, [x1, y1, x2, y2]);

  async function copy() {
    if (!result) return;
    const textOut = result.m === "undefined" ? "undefined" : result.m;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setX1("0");
    setY1("0");
    setX2("2");
    setY2("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Pendiente (m)" : "Slope (m)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.m}</p>
            <p className="text-sm text-muted-foreground">{es ? `Rise: ${result.rise}, Run: ${result.run}` : `Rise: ${result.rise}, Run: ${result.run}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Punto 1 X" : "Point 1 X"}</span>
          <input type="number" step="any" value={x1} onChange={(e) => setX1(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Punto 1 Y" : "Point 1 Y"}</span>
          <input type="number" step="any" value={y1} onChange={(e) => setY1(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Punto 2 X" : "Point 2 X"}</span>
          <input type="number" step="any" value={x2} onChange={(e) => setX2(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Punto 2 Y" : "Point 2 Y"}</span>
          <input type="number" step="any" value={y2} onChange={(e) => setY2(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: m = (y2 − y1) / (x2 − x1)" : "Formula: m = (y2 − y1) / (x2 − x1)"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "(0,0) a (2,4) → 2.0000" : "(0,0) to (2,4) → 2.0000"}</p>
        <p>{es ? "(1,1) a (1,5) → undefined (vertical)" : "(1,1) to (1,5) → undefined (vertical)"}</p>
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
