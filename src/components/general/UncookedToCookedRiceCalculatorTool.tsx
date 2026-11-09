import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type RiceType = "white" | "brown";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function UncookedToCookedRiceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [grams, setGrams] = useState("200");
  const [type, setType] = useState<RiceType>("white");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const g = parseFloat(grams);
    if (!Number.isFinite(g) || g <= 0) return null;
    const isWhite = type === "white";
    const cooked = isWhite ? g * 2.5 : g * 2.2;
    const waterMl = isWhite ? g * 1.5 : g * 2;
    const timeMin = isWhite ? 18 : 45;
    return { cooked: Math.round(cooked), waterMl: Math.round(waterMl), timeMin };
  }, [grams, type]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${grams} g ${type === "white" ? "blanco" : "integral"} → ~${result.cooked} g cocido, ${result.waterMl} ml agua, ~${result.timeMin} min`
      : `${grams} g ${type} → ~${result.cooked} g cooked, ${result.waterMl} ml water, ~${result.timeMin} min`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setGrams("200");
    setType("white");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Arroz crudo a cocido" : "Uncooked to cooked rice"}</p>
        {result ? (
          <>
            <p className="text-2xl font-semibold font-mono">~{result.cooked} g</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Agua: ${result.waterMl} ml · Tiempo: ~${result.timeMin} min` : `Water: ${result.waterMl} ml · Time: ~${result.timeMin} min`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá gramos positivos" : "Enter positive grams"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Gramos crudos" : "Uncooked grams"}</span>
        <input
          type="number"
          step="any"
          min="1"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tipo" : "Type"}</span>
        <select value={type} onChange={(e) => setType(e.target.value as RiceType)} className={fieldClass}>
          <option value="white">{es ? "Blanco" : "White"}</option>
          <option value="brown">{es ? "Integral" : "Brown"}</option>
        </select>
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "200 g blanco → ~500 g cocido, 300 ml agua, ~18 min" : "200 g white → ~500 g cooked, 300 ml water, ~18 min"}</p>
        <p>{es ? "100 g integral → ~220 g cocido, 200 ml agua, ~45 min" : "100 g brown → ~220 g cooked, 200 ml water, ~45 min"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {es ? "Relacionado: calculadora-agua-arroz, calculadora-escalado-receta" : "Related: calculadora-agua-arroz, calculadora-escalado-receta"}
      </p>
    </div>
  );
}
