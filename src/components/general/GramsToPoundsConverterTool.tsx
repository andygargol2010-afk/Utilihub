import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "g" | "lb";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const G_PER_LB = 453.59237;

export function GramsToPoundsConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<Unit>("g");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (isNaN(n) || n < 0 || n > 1e9) return null;
    let g = 0;
    if (from === "g") g = n;
    else g = n * G_PER_LB;
    const lb = g / G_PER_LB;
    return {
      g: Math.round(g * 100) / 100,
      lb: Math.round(lb * 10000) / 10000,
    };
  }, [amount, from]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `${amount} ${from === "g" ? "g" : "lb"} = ${result.lb} lb (${result.g} g)`
      : `${amount} ${from === "g" ? "g" : "lb"} = ${result.lb} lb (${result.g} g)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAmount("100");
    setFrom("g");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor gramos ↔ libras" : "Grams ↔ pounds converter"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.lb} lb</p>
            <p className="text-sm text-muted-foreground">
              {result.g} g
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Valor ≥ 0 (máx 1e9)" : "Value ≥ 0 (max 1e9)"}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Amount"}</span>
          <input type="number" step="0.1" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Desde" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="g">{es ? "Gramos (g)" : "Grams (g)"}</option>
            <option value="lb">{es ? "Libras (lb)" : "Pounds (lb)"}</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "1 lb = 453.59237 g. Útil para recetas y peso."
          : "1 lb = 453.59237 g. Useful for recipes and weight."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 g → 0.2205 lb" : "100 g → 0.2205 lb"}</p>
        <p>{es ? "1 lb → 453.59 g" : "1 lb → 453.59 g"}</p>
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
          <a href={es ? "/es/conversor-kg-libras" : "/conversor-kg-libras"} className="underline">
            {es ? "Conversor kg a libras" : "Kg to pounds converter"}
          </a>
          {" · "}
          <a href={es ? "/es/conversor-onzas-gramos" : "/conversor-onzas-gramos"} className="underline">
            {es ? "Conversor onzas a gramos" : "Ounces to grams converter"}
          </a>
        </p>
      </div>
    </div>
  );
}
