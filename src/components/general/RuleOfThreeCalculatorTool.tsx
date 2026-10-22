import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RuleOfThreeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("2");
  const [b, setB] = useState("10");
  const [c, setC] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const aa = parseFloat(a);
    const bb = parseFloat(b);
    const cc = parseFloat(c);
    if (isNaN(aa) || isNaN(bb) || isNaN(cc) || aa === 0) return null;
    if (Math.abs(aa) > 1e12 || Math.abs(bb) > 1e12 || Math.abs(cc) > 1e12) return null;
    const x = (bb * cc) / aa;
    return { x: Number.isFinite(x) ? x.toFixed(4).replace(/\.0+$/, "").replace(/(\.[0-9]*?)0+$/, "$1") : null };
  }, [a, b, c]);

  async function copy() {
    if (!result?.x) return;
    try {
      await navigator.clipboard.writeText(result.x);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setA("2");
    setB("10");
    setC("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado (X)" : "Result (X)"}</p>
        {result?.x != null ? (
          <p className="text-3xl font-semibold">{result.x}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos (A ≠ 0)" : "Valid values required (A ≠ 0)"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A (conocido)" : "A (known)"}</span>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "B (conocido)" : "B (known)"}</span>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "C (conocido)" : "C (known)"}</span>
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Si A corresponde a B, entonces C corresponde a X → X = (B × C) / A" : "If A corresponds to B, then C corresponds to X → X = (B × C) / A"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 → 10, 5 → X = 25" : "2 → 10, 5 → X = 25"}</p>
        <p>{es ? "4 → 20, 6 → X = 30" : "4 → 20, 6 → X = 30"}</p>
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
