import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageChangeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [initial, setInitial] = useState("100");
  const [final, setFinal] = useState("120");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const i = parseFloat(initial);
    const f = parseFloat(final);
    if (!Number.isFinite(i) || !Number.isFinite(f) || i === 0) return null;
    const change = ((f - i) / Math.abs(i)) * 100;
    return {
      change: Math.round(change * 100) / 100,
      absolute: Math.round((f - i) * 100) / 100,
      direction: change > 0 ? (es ? "aumento" : "increase") : change < 0 ? (es ? "disminuci\u00f3n" : "decrease") : (es ? "sin cambio" : "no change"),
    };
  }, [initial, final, es]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Cambio: ${result.change}% (${result.direction})`
      : `Change: ${result.change}% (${result.direction})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInitial("100");
    setFinal("120");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Cambio porcentual" : "Percentage change"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.change}%</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.direction} de ${result.absolute}` : `${result.direction} of ${result.absolute}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce valor inicial y final (inicial ≠ 0)" : "Enter initial and final values (initial ≠ 0)"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor inicial" : "Initial value"}</span>
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className={fieldClass}
            placeholder={es ? "Ej. 100" : "e.g. 100"}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor final" : "Final value"}</span>
          <input
            type="number"
            value={final}
            onChange={(e) => setFinal(e.target.value)}
            className={fieldClass}
            placeholder={es ? "Ej. 120" : "e.g. 120"}
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Cambio % = ((final - inicial) / |inicial|) \u00d7 100. Positivo = aumento, negativo = disminuci\u00f3n."
          : "Change % = ((final - initial) / |initial|) \u00d7 100. Positive = increase, negative = decrease."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 → 120 = +20%" : "100 → 120 = +20%"}</p>
        <p>{es ? "200 → 150 = -25%" : "200 → 150 = -25%"}</p>
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
          <a href={es ? "/es/calculadora-porcentaje-del-total" : "/calculadora-porcentaje-del-total"} className="underline">
            {es ? "Calculadora de porcentaje del total" : "Percentage of total calculator"}
          </a>
          {" \u00b7 "}
          <a href={es ? "/es/calculadora-porcentaje-restante" : "/calculadora-porcentaje-restante"} className="underline">
            {es ? "Calculadora de porcentaje restante" : "Percentage remaining calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
