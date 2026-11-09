import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const UNITS = {
  m: 1,
  cm: 0.01,
  km: 1000,
  mm: 0.001,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
} as const;

type Unit = keyof typeof UNITS;

export function LengthConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<Unit>("m");
  const [to, setTo] = useState<Unit>("ft");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return null;
    const inMeters = num * UNITS[from];
    const converted = inMeters / UNITS[to];
    return { value: Math.round(converted * 1000000) / 1000000, from, to };
  }, [value, from, to]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `${value} ${from} = ${result.value} ${to}`
      : `${value} ${from} = ${result.value} ${to}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("1");
    setFrom("m");
    setTo("ft");
    setCopied(false);
  }

  const unitLabels: Record<Unit, { en: string; es: string }> = {
    m: { en: "meters", es: "metros" },
    cm: { en: "centimeters", es: "centímetros" },
    km: { en: "kilometers", es: "kilómetros" },
    mm: { en: "millimeters", es: "milímetros" },
    in: { en: "inches", es: "pulgadas" },
    ft: { en: "feet", es: "pies" },
    yd: { en: "yards", es: "yardas" },
    mi: { en: "miles", es: "millas" },
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversión de longitud" : "Length conversion"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.value} {to}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un valor positivo" : "Enter a positive value"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" min="0" step="any" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            {(Object.keys(UNITS) as Unit[]).map((u) => (
              <option key={u} value={u}>{unitLabels[u][es ? "es" : "en"]} ({u})</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <select value={to} onChange={(e) => setTo(e.target.value as Unit)} className={fieldClass}>
            {(Object.keys(UNITS) as Unit[]).map((u) => (
              <option key={u} value={u}>{unitLabels[u][es ? "es" : "en"]} ({u})</option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>1 m → 3.28084 ft</p>
        <p>1 km → 0.621371 mi</p>
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
