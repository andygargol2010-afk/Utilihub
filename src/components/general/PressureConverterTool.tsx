import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const units = {
  bar: 1,
  psi: 14.5038,
  atm: 0.986923,
  kPa: 100,
  mmHg: 750.062,
};

export function PressureConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("bar");
  const [to, setTo] = useState("psi");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const inBar = v / units[from as keyof typeof units];
    const out = inBar * units[to as keyof typeof units];
    return { out: Math.round(out * 10000) / 10000 };
  }, [value, from, to]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.out} ${to}`;
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
    setFrom("bar");
    setTo("psi");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado de conversión" : "Conversion result"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.out} {to}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un valor" : "Enter a value"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={fieldClass}>
            {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={fieldClass}>
            {Object.keys(units).map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 bar → 14.5038 psi" : "1 bar → 14.5038 psi"}</p>
        <p>{es ? "1 atm → 1.01325 bar" : "1 atm → 1.01325 bar"}</p>
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
