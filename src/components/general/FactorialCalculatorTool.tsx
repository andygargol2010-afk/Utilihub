import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function factorial(n: number): bigint | null {
  if (!Number.isInteger(n) || n < 0 || n > 170) return null;
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}

export function FactorialCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [n, setN] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseInt(n, 10);
    if (isNaN(v)) return null;
    const f = factorial(v);
    return f !== null ? { n: v, fact: f.toString() } : null;
  }, [n]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `${result.n}! = ${result.fact}` : `${result.n}! = ${result.fact}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setN("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Factorial" : "Factorial"}</p>
        {result ? (
          <p className="text-3xl font-semibold break-all">{result.fact}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Entero 0–170" : "Integer 0–170"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "n (0–170)" : "n (0–170)"}</span>
          <input type="number" step="1" min="0" max="170" value={n} onChange={(e) => setN(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "5! = 120" : "5! = 120"}</p>
        <p>{es ? "10! = 3.628.800" : "10! = 3,628,800"}</p>
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
