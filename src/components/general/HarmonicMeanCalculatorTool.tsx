import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseNumbers(raw: string): number[] {
  return raw
    .split(/[\n,;\s]+/)
    .map((x) => Number(x.trim().replace(",", ".")))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export function HarmonicMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState("2, 3, 6");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const xs = parseNumbers(raw);
    if (xs.length < 1) return null;
    if (xs.length > 500) return null;
    const invSum = xs.reduce((a, x) => a + 1 / x, 0);
    if (invSum === 0) return null;
    const mean = xs.length / invSum;
    return { mean: Math.round(mean * 1e8) / 1e8, count: xs.length };
  }, [raw]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.mean}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRaw("2, 3, 6");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media armónica" : "Harmonic mean"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.mean}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.count} valores` : `${result.count} values`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es
              ? "Introduce números positivos separados por coma o espacio"
              : "Enter positive numbers separated by comma or space"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (positivos)" : "Numbers (positive)"}</span>
        <textarea
          rows={3}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={fieldClass}
          placeholder={es ? "2, 3, 6" : "2, 3, 6"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Fórmula: n / (1/x₁ + 1/x₂ + … + 1/xₙ). Útil para tasas, velocidades promedio y resistencias en paralelo."
          : "Formula: n / (1/x₁ + 1/x₂ + … + 1/xₙ). Useful for rates, average speeds and parallel resistances."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2, 3, 6 → 3" : "2, 3, 6 → 3"}</p>
        <p>{es ? "4, 4, 4 → 4" : "4, 4, 4 → 4"}</p>
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
