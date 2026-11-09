import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RiceWaterCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [riceCups, setRiceCups] = useState("1");
  const [ratio, setRatio] = useState("1.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const r = parseFloat(riceCups);
    const wRatio = parseFloat(ratio);
    if (isNaN(r) || r <= 0 || r > 50 || isNaN(wRatio) || wRatio <= 0 || wRatio > 5) return null;
    const water = r * wRatio;
    return {
      waterCups: Math.round(water * 100) / 100,
      waterMl: Math.round(water * 240),
    };
  }, [riceCups, ratio]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`${result.waterCups} ${es ? "tazas" : "cups"}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRiceCups("1");
    setRatio("1.5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Agua necesaria" : "Water needed"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">{result.waterCups} {es ? "tazas" : "cups"}</p>
            <p className="text-sm text-muted-foreground">≈ {result.waterMl} ml</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce tazas de arroz > 0" : "Enter rice cups > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tazas de arroz" : "Cups of rice"}</span>
        <input
          type="number"
          step="any"
          min="0.25"
          value={riceCups}
          onChange={(e) => setRiceCups(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ratio agua:arroz (1.5 = 1.5:1)" : "Water:rice ratio (1.5 = 1.5:1)"}</span>
        <input
          type="number"
          step="any"
          min="0.5"
          max="3"
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Ratio estándar arroz blanco ~1.5–2:1. Ajusta según tipo (basmati, integral)."
          : "Standard white rice ~1.5–2:1. Adjust for type (basmati, brown, etc.)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 taza arroz, ratio 1.5 → 1.5 tazas agua" : "1 cup rice, ratio 1.5 → 1.5 cups water"}</p>
        <p>{es ? "2 tazas arroz, ratio 2 → 4 tazas agua" : "2 cups rice, ratio 2 → 4 cups water"}</p>
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
