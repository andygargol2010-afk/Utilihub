import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ForceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mass, setMass] = useState("10");
  const [accel, setAccel] = useState("2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const m = parseFloat(mass);
    const a = parseFloat(accel);
    if (isNaN(m) || isNaN(a) || m < 0) return null;
    const force = m * a;
    return { force: Math.round(force * 100) / 100 };
  }, [mass, accel]);

  async function copy() {
    if (!result) return;
    const textOut = es ? `Fuerza: ${result.force} N` : `Force: ${result.force} N`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMass("10");
    setAccel("2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Fuerza" : "Force"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.force} N</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Masa (kg)" : "Mass (kg)"}</span>
          <input type="number" step="any" min="0" value={mass} onChange={(e) => setMass(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Aceleración (m/s²)" : "Acceleration (m/s²)"}</span>
          <input type="number" step="any" value={accel} onChange={(e) => setAccel(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "10 kg × 2 m/s² → 20 N" : "10 kg × 2 m/s² → 20 N"}</p>
        <p>{es ? "5 kg × 9.8 m/s² → 49 N" : "5 kg × 9.8 m/s² → 49 N"}</p>
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
