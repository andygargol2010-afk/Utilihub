import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "c" | "k";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const OFFSET = 273.15;

export function CelsiusKelvinConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [amount, setAmount] = useState("0");
  const [from, setFrom] = useState<Unit>("c");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (isNaN(n) || n < -273.15 || n > 10000) return null;
    let k = 0;
    if (from === "c") k = n + OFFSET;
    else k = n;
    return {
      k: Math.round(k * 100) / 100,
      c: Math.round((k - OFFSET) * 100) / 100,
    };
  }, [amount, from]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `${amount} ${from === "c" ? "°C" : "K"} = ${result.k} K (${result.c} °C)`
      : `${amount} ${from === "c" ? "°C" : "K"} = ${result.k} K (${result.c} °C)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAmount("0");
    setFrom("c");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor Celsius ↔ Kelvin" : "Celsius ↔ Kelvin converter"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.k} K</p>
            <p className="text-sm text-muted-foreground">
              {result.c} °C
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Temperatura ≥ -273.15 °C (máx 10000)" : "Temperature ≥ -273.15 °C (max 10000)"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Temperatura" : "Temperature"}</span>
          <input type="number" step="0.1" min="-273.15" value={amount} onChange={(e) => setAmount(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Desde" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="c">{es ? "Celsius (°C)" : "Celsius (°C)"}</option>
            <option value="k">Kelvin (K)</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Definición exacta: K = °C + 273.15. Útil para ciencia y termodinámica."
          : "Exact definition: K = °C + 273.15. Useful for science and thermodynamics."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "0 °C → 273.15 K" : "0 °C → 273.15 K"}</p>
        <p>{es ? "100 °C → 373.15 K" : "100 °C → 373.15 K"}</p>
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
          <a href={es ? "/es/conversor-de-temperatura" : "/conversor-de-temperatura"} className="underline">
            {es ? "Conversor de temperatura" : "Temperature converter"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-densidad" : "/calculadora-densidad"} className="underline">
            {es ? "Calculadora de densidad" : "Density calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
