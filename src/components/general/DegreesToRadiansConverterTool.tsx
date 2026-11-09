import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DegreesToRadiansConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [degrees, setDegrees] = useState("180");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d = parseFloat(degrees);
    if (!Number.isFinite(d)) return null;
    const rad = (d * Math.PI) / 180;
    const piMult = rad / Math.PI;
    return { rad, piMult };
  }, [degrees]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${degrees}° = ${result.rad.toFixed(6)} rad (≈ ${result.piMult.toFixed(4)} π)`
      : `${degrees}° = ${result.rad.toFixed(6)} rad (≈ ${result.piMult.toFixed(4)} π)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDegrees("180");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Grados a radianes" : "Degrees to radians"}</p>
        {result ? (
          <>
            <p className="text-2xl font-semibold font-mono">{result.rad.toFixed(6)} rad</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Múltiplo de π: ${result.piMult.toFixed(4)} π` : `π multiple: ${result.piMult.toFixed(4)} π`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá un número válido" : "Enter a valid number"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Grados" : "Degrees"}</span>
        <input
          type="number"
          step="any"
          value={degrees}
          onChange={(e) => setDegrees(e.target.value)}
          className={fieldClass}
        />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "180° → π rad (3.141593)" : "180° → π rad (3.141593)"}</p>
        <p>{es ? "90° → π/2 rad (1.570796)" : "90° → π/2 rad (1.570796)"}</p>
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
        {es ? "Relacionado: conversor-angulos, calculadora-hipotenusa" : "Related: conversor-angulos, calculadora-hipotenusa"}
      </p>
    </div>
  );
}
