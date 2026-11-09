import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PercentageOfTotalCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [part, setPart] = useState("25");
  const [total, setTotal] = useState("100");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(part);
    const t = parseFloat(total);
    if (!Number.isFinite(p) || !Number.isFinite(t) || t <= 0 || Math.abs(p) > 1e12 || Math.abs(t) > 1e12) return null;
    const pct = (p / t) * 100;
    return {
      percentage: Math.round(pct * 100) / 100,
      part: Math.round(p * 100) / 100,
      total: Math.round(t * 100) / 100,
    };
  }, [part, total]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${result.part} es el ${result.percentage}% de ${result.total}`
      : `${result.part} is ${result.percentage}% of ${result.total}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPart("25");
    setTotal("100");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Porcentaje del total" : "Percentage of total"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.percentage}%</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.part} de ${result.total}`
                : `${result.part} of ${result.total}`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce parte y total > 0" : "Enter part and total > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Parte" : "Part"}</span>
        <input
          type="number"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 25" : "e.g. 25"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Total" : "Total"}</span>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 100" : "e.g. 100"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula qué porcentaje representa una parte respecto al total."
          : "Calculate what percentage a part represents of the total."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Parte 25, total 100 → 25%" : "Part 25, total 100 → 25%"}</p>
        <p>{es ? "Parte 15, total 60 → 25%" : "Part 15, total 60 → 25%"}</p>
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
          <a href={es ? "/es/calculadora-porcentaje-restante" : "/calculadora-porcentaje-restante"} className="underline">
            {es ? "Calculadora de porcentaje restante" : "Percentage remaining calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-porcentaje-de-numero" : "/calculadora-porcentaje-de-numero"} className="underline">
            {es ? "Calculadora de porcentaje de un número" : "Percentage of a number calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
