import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function IdealWeightCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [heightCm, setHeightCm] = useState("170");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(heightCm);
    if (isNaN(h) || h < 100 || h > 250) return null;
    const inches = h / 2.54;
    const base = gender === "male" ? 50 : 45.5;
    const idealKg = base + 2.3 * Math.max(0, inches - 60);
    return { kg: Number.isFinite(idealKg) ? idealKg.toFixed(1) : null };
  }, [heightCm, gender]);

  async function copy() {
    if (!result?.kg) return;
    try {
      await navigator.clipboard.writeText(result.kg);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHeightCm("170");
    setGender("male");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Peso ideal (kg)" : "Ideal weight (kg)"}</p>
        {result?.kg != null ? (
          <p className="text-3xl font-semibold">{result.kg} kg</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Altura entre 100 y 250 cm" : "Height between 100 and 250 cm"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
          <input type="number" min="100" max="250" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Sexo" : "Gender"}</span>
          <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female")} className={fieldClass}>
            <option value="male">{es ? "Masculino" : "Male"}</option>
            <option value="female">{es ? "Femenino" : "Female"}</option>
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula de Devine" : "Devine formula"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hombre 180 cm → ~75.0 kg" : "Male 180 cm → ~75.0 kg"}</p>
        <p>{es ? "Mujer 160 cm → ~56.0 kg" : "Female 160 cm → ~56.0 kg"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result?.kg}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
