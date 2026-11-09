import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseList(s: string): number[] {
  return s
    .split(/[,;\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => parseFloat(x))
    .filter((n) => Number.isFinite(n));
}

export function QuadraticMeanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [valuesStr, setValuesStr] = useState("1, 2, 3");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const values = parseList(valuesStr);
    if (values.length === 0) return null;
    if (values.some((v) => !Number.isFinite(v))) return null;
    const n = values.length;
    const sumSq = values.reduce((acc, v) => acc + v * v, 0);
    const rms = Math.sqrt(sumSq / n);
    const rounded = Math.round(rms * 10000) / 10000;
    return { rms: rounded, n, sumSq: Math.round(sumSq * 10000) / 10000 };
  }, [valuesStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Media cuadrática (RMS): ${result.rms}`
      : `Quadratic mean (RMS): ${result.rms}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValuesStr("1, 2, 3");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Media cuadrática (RMS)" : "Quadratic mean (RMS)"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.rms}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.n} valores · Σ(x²) = ${result.sumSq}`
                : `${result.n} values · Σ(x²) = ${result.sumSq}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce al menos un número finito" : "Enter at least one finite number"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Números (separados por coma)" : "Numbers (comma-separated)"}</span>
        <input
          type="text"
          value={valuesStr}
          onChange={(e) => setValuesStr(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1, 2, 3" : "e.g. 1, 2, 3"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula sqrt( Σ(x_i²) / n ). Útil para magnitudes de señales, voltajes AC o cuando los valores grandes deben pesar más."
          : "Computes sqrt( Σ(x_i²) / n ). Useful for signal magnitudes, AC voltages, or when larger values should weigh more."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1, 2, 3 → 2.1602" : "1, 2, 3 → 2.1602"}</p>
        <p>{es ? "10, 20 → 15.8114" : "10, 20 → 15.8114"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a className="underline" href={es ? "/es/tools/calculadora-promedio-simple" : "/tools/calculadora-promedio-simple"}>
            {es ? "Calculadora de promedio simple" : "Simple average calculator"}
          </a>
          {" · "}
          <a className="underline" href={es ? "/es/tools/calculadora-media-ponderada" : "/tools/calculadora-media-ponderada"}>
            {es ? "Media ponderada" : "Weighted average"}
          </a>
        </p>
      </div>
    </div>
  );
}
