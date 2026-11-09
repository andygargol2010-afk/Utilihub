import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageDifferenceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("100");
  const [b, setB] = useState("120");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const va = parseFloat(a);
    const vb = parseFloat(b);
    if (!Number.isFinite(va) || !Number.isFinite(vb) || Math.abs(va) > 1e9 || Math.abs(vb) > 1e9) return null;
    if (va === 0 && vb === 0) return { diff: 0, relative: 0 };
    const avg = (Math.abs(va) + Math.abs(vb)) / 2;
    if (avg === 0) return null;
    const absDiff = Math.abs(vb - va);
    const pct = (absDiff / avg) * 100;
    return { diff: absDiff, relative: Math.round(pct * 100) / 100 };
  }, [a, b]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Diferencia absoluta: ${result.diff} | Diferencia porcentual: ${result.relative}%`
      : `Absolute difference: ${result.diff} | Percentage difference: ${result.relative}%`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setA("100");
    setB("120");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Diferencia porcentual" : "Percentage difference"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.relative}%</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Diferencia absoluta: ${result.diff}` : `Absolute difference: ${result.diff}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce dos números válidos" : "Enter two valid numbers"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor A" : "Value A"}</span>
        <input
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 100" : "e.g. 100"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor B" : "Value B"}</span>
        <input
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 120" : "e.g. 120"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la diferencia porcentual relativa al promedio de ambos valores."
          : "Calculates the percentage difference relative to the average of both values."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 y 120 → 18.18%" : "100 and 120 → 18.18%"}</p>
        <p>{es ? "50 y 75 → 40%" : "50 and 75 → 40%"}</p>
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
