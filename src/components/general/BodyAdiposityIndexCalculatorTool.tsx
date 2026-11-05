import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function BodyAdiposityIndexCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [heightCm, setHeightCm] = useState("170");
  const [hipCm, setHipCm] = useState("95");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(heightCm);
    const hip = parseFloat(hipCm);
    if (!Number.isFinite(h) || h <= 0 || !Number.isFinite(hip) || hip <= 0) return null;
    const heightM = h / 100;
    const bai = hip / Math.pow(heightM, 1.5) - 18;
    return { bai: Math.round(bai * 10) / 10 };
  }, [heightCm, hipCm]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Altura ${heightCm} cm, cadera ${hipCm} cm → BAI ≈ ${result.bai}`
      : `Height ${heightCm} cm, hip ${hipCm} cm → BAI ≈ ${result.bai}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHeightCm("170");
    setHipCm("95");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Índice de Adiposidad Corporal (BAI)" : "Body Adiposity Index (BAI)"}</p>
        {result ? (
          <p className="text-2xl font-semibold font-mono">≈ {result.bai}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá altura y cadera positivas" : "Enter positive height and hip"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Altura (cm)" : "Height (cm)"}</span>
        <input
          type="number"
          step="any"
          min="1"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Circunferencia de cadera (cm)" : "Hip circumference (cm)"}</span>
        <input
          type="number"
          step="any"
          min="1"
          value={hipCm}
          onChange={(e) => setHipCm(e.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "170 cm, cadera 95 cm → BAI ≈ 24.9" : "170 cm, hip 95 cm → BAI ≈ 24.9"}</p>
        <p>{es ? "160 cm, cadera 100 cm → BAI ≈ 31.4" : "160 cm, hip 100 cm → BAI ≈ 31.4"}</p>
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
        {es ? "Relacionado: calculadora-imc, calculadora-ratio-cintura-altura" : "Related: calculadora-imc, calculadora-ratio-cintura-altura"}
      </p>
    </div>
  );
}
