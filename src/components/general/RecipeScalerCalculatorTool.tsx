import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./RecipeScalerCalculatorTool.part1";
import { scale, buttonClass, fieldClass } from "./RecipeScalerCalculatorTool.part2";

export function RecipeScalerCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"factor" | "servings">("factor");
  const [original, setOriginal] = useState("200");
  const [factor, setFactor] = useState("2");
  const [origServings, setOrigServings] = useState("4");
  const [targetServings, setTargetServings] = useState("6");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const o = parseFloat(original);
    let f = parseFloat(factor);
    if (mode === "servings") {
      const os = parseFloat(origServings);
      const ts = parseFloat(targetServings);
      if (!Number.isFinite(os) || os <= 0 || !Number.isFinite(ts) || ts <= 0) return { error: es ? "Porciones deben ser positivas" : "Servings must be positive" };
      f = ts / os;
    }
    const r = scale(o, f);
    if (typeof r === "object") {
      return { error: es ? "Valores deben ser positivos" : "Values must be positive" };
    }
    return { result: r, factor: f };
  }, [mode, original, factor, origServings, targetServings, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.result.toFixed(2);
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setOriginal("200");
    setFactor("2");
    setOrigServings("4");
    setTargetServings("6");
    setMode("factor");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.result.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{es ? `Factor aplicado: ${result.factor.toFixed(3)}` : `Applied factor: ${result.factor.toFixed(3)}`}</p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa valores" : "Enter values"}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${mode === "factor" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("factor")}>
          {es ? "Por factor" : "By factor"}
        </button>
        <button type="button" className={`${buttonClass} ${mode === "servings" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("servings")}>
          {es ? "Por porciones" : "By servings"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cantidad original" : "Original amount"}</span>
          <input type="number" step="any" min="0" value={original} onChange={(e) => setOriginal(e.target.value)} className={fieldClass} />
        </label>
        {mode === "factor" ? (
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{es ? "Factor" : "Factor"}</span>
            <input type="number" step="any" min="0" value={factor} onChange={(e) => setFactor(e.target.value)} className={fieldClass} />
          </label>
        ) : (
          <>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">{es ? "Porciones originales" : "Original servings"}</span>
              <input type="number" step="1" min="1" value={origServings} onChange={(e) => setOrigServings(e.target.value)} className={fieldClass} />
            </label>
            <label className="block space-y-2 text-sm">
              <span className="font-medium">{es ? "Porciones objetivo" : "Target servings"}</span>
              <input type="number" step="1" min="1" value={targetServings} onChange={(e) => setTargetServings(e.target.value)} className={fieldClass} />
            </label>
          </>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Multiplica la cantidad original por el factor. Valores positivos. Cálculo local."
          : "Multiplies original amount by the factor. Positive values. Local calculation."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>200 × 2 = 400</p>
        <p>300 ml (4→6 porciones, factor 1.5) = 450 ml</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-porciones-pizza" : "/tools/calculadora-porciones-pizza"} className="underline text-primary">
            {es ? "Porciones de pizza" : "Pizza servings"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-calorias-porcion" : "/tools/calculadora-calorias-porcion"} className="underline text-primary">
            {es ? "Calorías por porción" : "Calories per serving"}
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
