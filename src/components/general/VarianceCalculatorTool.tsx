import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseNumbers(raw: string): number[] {
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n) && Number.isFinite(n));
}

function mean(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function variance(nums: number[], sample: boolean) {
  if (nums.length < (sample ? 2 : 1)) return null;
  const m = mean(nums);
  const sumSq = nums.reduce((acc, n) => acc + (n - m) ** 2, 0);
  const denom = sample ? nums.length - 1 : nums.length;
  return sumSq / denom;
}

export function VarianceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState("1, 2, 3, 4, 5");
  const [sample, setSample] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const nums = parseNumbers(raw);
    if (nums.length === 0) return null;
    const m = mean(nums);
    const v = variance(nums, sample);
    if (v === null) return { error: es ? "Se necesitan al menos 2 valores para varianza muestral" : "At least 2 values needed for sample variance" };
    const sd = Math.sqrt(v);
    return { mean: m, variance: v, sd, n: nums.length, sample };
  }, [raw, sample, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Media: ${result.mean.toFixed(4)} | Varianza ${result.sample ? "muestral" : "poblacional"}: ${result.variance.toFixed(4)} | DE: ${result.sd.toFixed(4)}`
      : `Mean: ${result.mean.toFixed(4)} | ${result.sample ? "Sample" : "Population"} variance: ${result.variance.toFixed(4)} | SD: ${result.sd.toFixed(4)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRaw("1, 2, 3, 4, 5");
    setSample(true);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calculadora de varianza" : "Variance calculator"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.variance.toFixed(4)}</p>
            <p className="text-sm text-muted-foreground">
              {es ? (result.sample ? "Varianza muestral" : "Varianza poblacional") : result.sample ? "Sample variance" : "Population variance"}
              {" · n="}{result.n}
            </p>
            <p className="text-sm">
              {es ? "Media" : "Mean"}: {result.mean.toFixed(4)} · {es ? "Desv. est." : "Std. dev."}: {result.sd.toFixed(4)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{result && "error" in result ? result.error : es ? "Introduce números válidos" : "Enter valid numbers"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (separados por coma, espacio o salto de línea)" : "Numbers (comma, space or newline separated)"}</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={4}
          className={fieldClass}
          placeholder="1 2 3 4 5"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={sample} onChange={(e) => setSample(e.target.checked)} />
        <span>{es ? "Varianza muestral (dividir por n-1)" : "Sample variance (divide by n-1)"}</span>
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula la media, la varianza (muestral o poblacional) y la desviación estándar."
          : "Calculates the mean, variance (sample or population) and standard deviation."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 2, 3, 4, 5 → media 3, varianza muestral 2.5, DE ≈1.581" : "1, 2, 3, 4, 5 → mean 3, sample variance 2.5, SD ≈1.581"}</p>
        <p>{es ? "10, 20, 30 (poblacional) → media 20, varianza 66.67, DE ≈8.165" : "10, 20, 30 (population) → mean 20, variance 66.67, SD ≈8.165"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-desviacion-estandar" : "/tools/calculadora-desviacion-estandar"} className="underline text-primary">
            {es ? "Calculadora de desviación estándar" : "Standard deviation calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-media-aritmetica" : "/tools/calculadora-media-aritmetica"} className="underline text-primary">
            {es ? "Media aritmética" : "Arithmetic mean"}
          </a>
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
