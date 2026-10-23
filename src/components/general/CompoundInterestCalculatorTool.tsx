import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CompoundInterestCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("2");
  const [n, setN] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const comp = parseFloat(n);
    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(comp) || P <= 0 || r < 0 || t <= 0 || comp <= 0 || P > 1e12 || t > 100 || comp > 365) return null;
    const A = P * Math.pow(1 + r / comp, comp * t);
    return { A: A.toFixed(2), interest: (A - P).toFixed(2) };
  }, [principal, rate, years, n]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.A);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrincipal("1000");
    setRate("5");
    setYears("2");
    setN("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Monto final (A)" : "Final amount (A)"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.A}</p>
            <p className="text-sm text-muted-foreground">{es ? `Interés ganado: ${result.interest}` : `Interest earned: ${result.interest}`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Principal (P)" : "Principal (P)"}</span>
          <input type="number" step="any" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tasa anual %" : "Annual rate %"}</span>
          <input type="number" step="any" min="0" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Años (t)" : "Years (t)"}</span>
          <input type="number" step="any" min="0" value={years} onChange={(e) => setYears(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Compuestos por año (n)" : "Compounds per year (n)"}</span>
          <input type="number" step="1" min="1" value={n} onChange={(e) => setN(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: A = P (1 + r/n)^(n*t)" : "Formula: A = P (1 + r/n)^(n*t)"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1000 a 5% por 2 años, anual → 1102.50" : "1000 at 5% for 2 years, annual → 1102.50"}</p>
        <p>{es ? "1000 a 5% por 2 años, mensual → 1104.89" : "1000 at 5% for 2 years, monthly → 1104.89"}</p>
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
