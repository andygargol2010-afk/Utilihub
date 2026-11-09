import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const FACTOR = 4.184; // 1 kcal = 4.184 kJ

function convert(value: number, from: "kcal" | "kj"): number | { error: string } {
  if (!Number.isFinite(value) || value < 0) return { error: "negative" };
  if (from === "kcal") return value * FACTOR;
  return value / FACTOR;
}

export function KcalKjConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("250");
  const [from, setFrom] = useState<"kcal" | "kj">("kcal");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    const r = convert(v, from);
    if (typeof r === "object") {
      return { error: es ? "El valor debe ser un número no negativo" : "Value must be a non-negative number" };
    }
    return { result: r, unit: from === "kcal" ? "kJ" : "kcal" };
  }, [value, from, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const t = result.result.toFixed(2) + " " + result.unit;
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("250");
    setFrom("kcal");
    setCopied(false);
  }

  function swap() {
    setFrom(from === "kcal" ? "kj" : "kcal");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.result.toFixed(2)} {result.unit}</p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa un valor" : "Enter a value"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" step="any" min="0" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} placeholder="250" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Desde" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as "kcal" | "kj")} className={fieldClass}>
            <option value="kcal">kcal</option>
            <option value="kj">kJ</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Factor de conversión: 1 kcal = 4.184 kJ (caloría termodinámica). Valores no negativos."
          : "Conversion factor: 1 kcal = 4.184 kJ (thermochemical calorie). Non-negative values."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>250 kcal = 1046 kJ</p>
        <p>1000 kJ ≈ 239.01 kcal</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-calorias-porcion" : "/tools/calculadora-calorias-porcion"} className="underline text-primary">
            {es ? "Calorías por porción" : "Calories per serving"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/conversor-celsius-a-fahrenheit" : "/tools/conversor-celsius-a-fahrenheit"} className="underline text-primary">
            {es ? "Conversor Celsius a Fahrenheit" : "Celsius to Fahrenheit converter"}
          </a>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={swap}>
          {es ? "Invertir unidades" : "Swap units"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
