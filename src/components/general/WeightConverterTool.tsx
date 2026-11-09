import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const UNITS = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.028349523125,
  st: 6.35029318,
} as const;

type Unit = keyof typeof UNITS;

export function WeightConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState<Unit>("kg");
  const [to, setTo] = useState<Unit>("lb");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v < 0) return null;
    const inKg = v * UNITS[from];
    const out = inKg / UNITS[to];
    return Math.round(out * 10000) / 10000;
  }, [value, from, to]);

  async function copy() {
    if (result == null) return;
    const textOut = es
      ? `${value} ${from} = ${result} ${to}`
      : `${value} ${from} = ${result} ${to}`;
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
    setFrom("kg");
    setTo("lb");
    setCopied(false);
  }

  const unitLabel = (u: Unit) => {
    if (es) {
      if (u === "kg") return "kg";
      if (u === "g") return "g";
      if (u === "lb") return "lb";
      if (u === "oz") return "oz";
      if (u === "st") return "st";
    }
    return u;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result != null ? (
          <p className="text-3xl font-semibold">{result} {unitLabel(to)}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valor ≥ 0" : "Value ≥ 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" step="any" min="0" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="st">st</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <select value={to} onChange={(e) => setTo(e.target.value as Unit)} className={fieldClass}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
            <option value="st">st</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 kg → 2.2046 lb" : "1 kg → 2.2046 lb"}</p>
        <p>{es ? "16 oz → 0.4536 kg" : "16 oz → 0.4536 kg"}</p>
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
