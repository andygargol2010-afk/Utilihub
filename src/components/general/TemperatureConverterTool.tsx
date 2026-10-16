import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "C" | "F" | "K";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function convert(value: number, from: Unit, to: Unit): number {
  let celsius: number;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15; // K

  if (to === "C") return celsius;
  if (to === "F") return celsius * 9 / 5 + 32;
  return celsius + 273.15; // K
}

export function TemperatureConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("0");
  const [from, setFrom] = useState<Unit>("C");
  const [to, setTo] = useState<Unit>("F");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const converted = convert(v, from, to);
    return { converted: Math.round(converted * 100) / 100, from, to, value: v };
  }, [value, from, to]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.value}°${result.from} = ${result.converted}°${result.to}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("0");
    setFrom("C");
    setTo("F");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Temperatura convertida" : "Converted temperature"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.converted}°{result.to}</p>
            <p className="text-sm text-muted-foreground">
              {result.value}°{result.from} → {result.converted}°{result.to}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valor inválido" : "Invalid value"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
            <option value="K">Kelvin (K)</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <select value={to} onChange={(e) => setTo(e.target.value as Unit)} className={fieldClass}>
            <option value="C">Celsius (°C)</option>
            <option value="F">Fahrenheit (°F)</option>
            <option value="K">Kelvin (K)</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>0°C → 32°F</p>
        <p>100°C → 212°F</p>
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
