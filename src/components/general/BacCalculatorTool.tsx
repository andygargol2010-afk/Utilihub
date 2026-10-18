import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function BacCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [drinks, setDrinks] = useState("2");
  const [weight, setWeight] = useState("70");
  const [gender, setGender] = useState("male");
  const [hours, setHours] = useState("1");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(drinks);
    const w = parseFloat(weight);
    const h = parseFloat(hours);
    if (isNaN(d) || isNaN(w) || isNaN(h) || d < 0 || w <= 0 || h < 0) return null;
    const alcoholGrams = d * 14;
    const r = gender === "female" ? 0.55 : 0.68;
    const bacRaw = (alcoholGrams / (w * r)) - (0.15 * h);
    const bac = Math.max(0, Math.round(bacRaw * 1000) / 1000);
    return { bac };
  }, [drinks, weight, gender, hours]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `BAC estimado: ${result.bac}%` : `Estimated BAC: ${result.bac}%`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDrinks("2");
    setWeight("70");
    setGender("male");
    setHours("1");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "BAC estimado" : "Estimated BAC"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.bac}%</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
        <p className="text-xs text-muted-foreground">{es ? "Estimación aproximada. No uses para decidir conducir." : "Rough estimate only. Do not use to decide driving."}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Bebidas estándar" : "Standard drinks"}</span>
          <input type="number" step="any" min="0" value={drinks} onChange={(e) => setDrinks(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Peso (kg)" : "Weight (kg)"}</span>
          <input type="number" step="any" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Género" : "Gender"}</span>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={fieldClass}>
            <option value="male">{es ? "Hombre" : "Male"}</option>
            <option value="female">{es ? "Mujer" : "Female"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Horas desde primera bebida" : "Hours since first drink"}</span>
          <input type="number" step="any" min="0" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 bebidas, 70 kg hombre, 1 h → ~0.043%" : "2 drinks, 70 kg male, 1 h → ~0.043%"}</p>
        <p>{es ? "3 bebidas, 60 kg mujer, 2 h → ~0.091%" : "3 drinks, 60 kg female, 2 h → ~0.091%"}</p>
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
