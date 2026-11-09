import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "tbsp" | "tsp" | "ml";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const ML_PER_TBSP = 15;
const ML_PER_TSP = 5;

export function TablespoonMlConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [amount, setAmount] = useState("2");
  const [from, setFrom] = useState<Unit>("tbsp");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const n = parseFloat(amount);
    if (isNaN(n) || n < 0 || n > 10000) return null;
    let ml = 0;
    if (from === "tbsp") ml = n * ML_PER_TBSP;
    else if (from === "tsp") ml = n * ML_PER_TSP;
    else ml = n;
    return {
      ml: Math.round(ml * 100) / 100,
      tbsp: Math.round((ml / ML_PER_TBSP) * 100) / 100,
      tsp: Math.round((ml / ML_PER_TSP) * 100) / 100,
    };
  }, [amount, from]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `${amount} ${from} = ${result.ml} ml (${result.tbsp} cucharadas / ${result.tsp} cucharaditas)`
      : `${amount} ${from} = ${result.ml} ml (${result.tbsp} tbsp / ${result.tsp} tsp)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAmount("2");
    setFrom("tbsp");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor cucharadas ↔ ml" : "Tablespoon ↔ ml converter"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.ml} ml</p>
            <p className="text-sm text-muted-foreground">
              {result.tbsp} {es ? "cucharadas" : "tbsp"} · {result.tsp} {es ? "cucharaditas" : "tsp"}
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
            <option value="tbsp">{es ? "Cucharadas (tbsp)" : "Tablespoons (tbsp)"}</option>
            <option value="tsp">{es ? "Cucharaditas (tsp)" : "Teaspoons (tsp)"}</option>
            <option value="ml">ml</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Estándar de cocina US: 1 cucharada = 15 ml, 1 cucharadita = 5 ml. Útil para recetas."
          : "US cooking standard: 1 tbsp = 15 ml, 1 tsp = 5 ml. Useful for recipes."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 cucharadas → 30 ml" : "2 tbsp → 30 ml"}</p>
        <p>{es ? "3 cucharaditas → 15 ml" : "3 tsp → 15 ml"}</p>
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
          <a href={es ? "/es/calculadora-agua-arroz" : "/calculadora-agua-arroz"} className="underline">
            {es ? "Calculadora de agua para arroz" : "Rice water calculator"}
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
