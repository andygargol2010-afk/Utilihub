import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function StandardDeviationCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState("2, 4, 4, 4, 5, 5, 7, 9");
  const [mode, setMode] = useState<"sample" | "population">("sample");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const nums = raw
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n) && Math.abs(n) < 1e12);
    if (nums.length < 2) return null;
    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const sumSq = nums.reduce((a, b) => a + (b - mean) ** 2, 0);
    const denom = mode === "sample" ? n - 1 : n;
    if (denom <= 0) return null;
    const variance = sumSq / denom;
    const sd = Math.sqrt(variance);
    return {
      n,
      mean: mean.toFixed(4),
      variance: variance.toFixed(4),
      sd: sd.toFixed(4),
    };
  }, [raw, mode]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.sd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRaw("2, 4, 4, 4, 5, 5, 7, 9");
    setMode("sample");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Desviación estándar" : "Standard deviation"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.sd}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Media: ${result.mean} · Varianza: ${result.variance} · n = ${result.n}`
                : `Mean: ${result.mean} · Variance: ${result.variance} · n = ${result.n}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce al menos 2 números válidos" : "Enter at least 2 valid numbers"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (separados por coma o espacio)" : "Numbers (comma or space separated)"}</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          className={fieldClass}
          placeholder="2, 4, 4, 4, 5, 5, 7, 9"
        />
      </label>

      <div className="flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="sd-mode" checked={mode === "sample"} onChange={() => setMode("sample")} />
          {es ? "Muestra (n − 1)" : "Sample (n − 1)"}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="sd-mode" checked={mode === "population"} onChange={() => setMode("population")} />
          {es ? "Población (n)" : "Population (n)"}
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Fórmula: √(Σ(x − μ)² / (n − 1)) para muestra; divisor n para población."
          : "Formula: √(Σ(x − μ)² / (n − 1)) for sample; divisor n for population."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>
          {es
            ? "2, 4, 4, 4, 5, 5, 7, 9 (muestra) → ~2.1381"
            : "2, 4, 4, 4, 5, 5, 7, 9 (sample) → ~2.1381"}
        </p>
        <p>
          {es
            ? "10, 12, 23, 23, 16, 23, 21, 16 (muestra) → ~5.2372"
            : "10, 12, 23, 23, 16, 23, 21, 16 (sample) → ~5.2372"}
        </p>
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
