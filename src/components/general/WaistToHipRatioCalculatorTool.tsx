import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WaistToHipRatioCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [waist, setWaist] = useState("80");
  const [hip, setHip] = useState("100");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (Number.isNaN(w) || Number.isNaN(h) || !Number.isFinite(w) || !Number.isFinite(h)) return null;
    if (w <= 0 || h <= 0) return { error: es ? "Valores deben ser mayores que cero" : "Values must be greater than zero" };
    if (w > 200 || h > 200) return { error: es ? "Valores fuera de rango razonable" : "Values outside reasonable range" };
    const ratio = w / h;
    return { ratio, w, h };
  }, [waist, hip, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Ratio cintura-cadera: ${result.ratio.toFixed(2)} (cintura ${result.w} / cadera ${result.h})`
      : `Waist-to-hip ratio: ${result.ratio.toFixed(2)} (waist ${result.w} / hip ${result.h})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setWaist("80");
    setHip("100");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Ratio cintura-cadera (WHR)" : "Waist-to-hip ratio (WHR)"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.ratio.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {result.w} / {result.h}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cintura (cm)" : "Waist (cm)"}</span>
          <input
            type="number"
            min="1"
            step="any"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className={fieldClass}
            placeholder="80"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Cadera (cm)" : "Hip (cm)"}</span>
          <input
            type="number"
            min="1"
            step="any"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
            className={fieldClass}
            placeholder="100"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Mide la cintura en la parte más estrecha y la cadera en la más ancha. Usa las mismas unidades."
          : "Measure waist at the narrowest point and hip at the widest. Use the same units."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "80 cm / 100 cm = 0.80" : "80 cm / 100 cm = 0.80"}</p>
        <p>{es ? "90 cm / 95 cm = 0.95" : "90 cm / 95 cm = 0.95"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-imc" : "/tools/calculadora-imc"} className="underline text-primary">
            {es ? "Calculadora de IMC" : "BMI calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-ratio-cintura-altura" : "/tools/calculadora-ratio-cintura-altura"} className="underline text-primary">
            {es ? "Ratio cintura-altura" : "Waist-to-height ratio"}
          </a>
        </p>
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
