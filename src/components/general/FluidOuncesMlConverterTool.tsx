import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "floz" | "ml";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const ML_PER_FLOZ = 29.5735; // US fluid ounce

export function FluidOuncesMlConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [amount, setAmount] = useState("8");
  const [from, setFrom] = useState<Unit>("floz");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (isNaN(n) || n < 0 || n > 10000) return null;
    let ml = 0;
    if (from === "floz") ml = n * ML_PER_FLOZ;
    else ml = n;
    return {
      ml: Math.round(ml * 100) / 100,
      floz: Math.round((ml / ML_PER_FLOZ) * 100) / 100,
    };
  }, [amount, from]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `${amount} ${from} = ${result.ml} ml (${result.floz} onzas líquidas)`
      : `${amount} ${from} = ${result.ml} ml (${result.floz} fl oz)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAmount("8");
    setFrom("floz");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor onzas líquidas ↔ ml" : "Fluid ounces ↔ ml converter"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.ml} ml</p>
            <p className="text-sm text-muted-foreground">
              {result.floz} {es ? "onzas líquidas" : "fl oz"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Cantidad ≥ 0 (máx 10000)" : "Amount ≥ 0 (max 10000)"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Amount"}</span>
          <input type="number" step="0.25" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Desde" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="floz">{es ? "Onzas líquidas (fl oz)" : "Fluid ounces (fl oz)"}</option>
            <option value="ml">ml</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Estándar US: 1 onza líquida = 29.5735 ml. Útil para recetas y bebidas."
          : "US standard: 1 fluid ounce = 29.5735 ml. Useful for recipes and drinks."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "8 fl oz → 236.59 ml" : "8 fl oz → 236.59 ml"}</p>
        <p>{es ? "1 fl oz → 29.57 ml" : "1 fl oz → 29.57 ml"}</p>
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
          <a href={es ? "/es/conversor-cucharadas-ml" : "/conversor-cucharadas-ml"} className="underline">
            {es ? "Conversor cucharadas a ml" : "Tablespoon to ml converter"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-porciones-pizza" : "/calculadora-porciones-pizza"} className="underline">
            {es ? "Calculadora de porciones de pizza" : "Pizza portions calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
