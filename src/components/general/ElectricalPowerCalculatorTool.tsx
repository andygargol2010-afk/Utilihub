import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function ElectricalPowerCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [voltage, setVoltage] = useState("120");
  const [current, setCurrent] = useState("5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    if (isNaN(v) || isNaN(i) || v < 0 || i < 0 || v > 10000 || i > 1000) return null;
    const power = v * i;
    return { watts: power.toFixed(2) };
  }, [voltage, current]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.watts} W`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setVoltage("120");
    setCurrent("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Potencia eléctrica" : "Electrical power"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.watts} W</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Voltaje (V)" : "Voltage (V)"}</span>
          <input type="number" min="0" max="10000" value={voltage} onChange={(e) => setVoltage(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Corriente (A)" : "Current (A)"}</span>
          <input type="number" step="0.1" min="0" max="1000" value={current} onChange={(e) => setCurrent(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">{es ? "Fórmula: P = V × I" : "Formula: P = V × I"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "120 V, 5 A → 600.00 W" : "120 V, 5 A → 600.00 W"}</p>
        <p>{es ? "230 V, 10 A → 2300.00 W" : "230 V, 10 A → 2300.00 W"}</p>
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
