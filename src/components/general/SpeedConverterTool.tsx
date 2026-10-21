import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "kmh" | "mph" | "ms" | "kn";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const factors: Record<Unit, number> = {
  kmh: 1,
  mph: 1.609344,
  ms: 3.6,
  kn: 1.852,
};

function convert(value: number, from: Unit, to: Unit): number {
  const inKmh = value * factors[from];
  return inKmh / factors[to];
}

export function SpeedConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState<Unit>("kmh");
  const [to, setTo] = useState<Unit>("mph");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    const converted = convert(v, from, to);
    return { converted: Math.round(converted * 100) / 100, from, to, value: v };
  }, [value, from, to]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.value} ${result.from} = ${result.converted} ${result.to}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("100");
    setFrom("kmh");
    setTo("mph");
    setCopied(false);
  }

  const unitLabel = (u: Unit) => {
    if (u === "kmh") return "km/h";
    if (u === "mph") return "mph";
    if (u === "ms") return "m/s";
    return "knots";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Velocidad convertida" : "Converted speed"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.converted} {unitLabel(result.to)}</p>
            <p className="text-sm text-muted-foreground">
              {result.value} {unitLabel(result.from)} → {result.converted} {unitLabel(result.to)}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valor positivo válido" : "Valid positive value"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
            <option value="kn">knots</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <select value={to} onChange={(e) => setTo(e.target.value as Unit)} className={fieldClass}>
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
            <option value="ms">m/s</option>
            <option value="kn">knots</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>100 km/h → 62.14 mph</p>
        <p>10 m/s → 36 km/h</p>
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
