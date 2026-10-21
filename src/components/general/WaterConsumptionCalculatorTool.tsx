import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WaterConsumptionCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [liters, setLiters] = useState("150");
  const [days, setDays] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(liters);
    const d = parseFloat(days);
    if (isNaN(l) || isNaN(d) || l < 0 || d <= 0) return null;
    const monthly = l * d;
    const yearly = monthly * 12;
    return { monthly: Math.round(monthly), yearly: Math.round(yearly) };
  }, [liters, days]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Mensual: ${result.monthly} L · Anual: ${result.yearly} L`
      : `Monthly: ${result.monthly} L · Yearly: ${result.yearly} L`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLiters("150");
    setDays("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Consumo de agua" : "Water consumption"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.monthly} L</p>
            <p className="text-sm">{es ? `Anual: ${result.yearly} L` : `Yearly: ${result.yearly} L`}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Litros ≥ 0, días > 0" : "Liters ≥ 0, days > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Litros por día" : "Liters per day"}</span>
          <input type="number" step="any" min="0" value={liters} onChange={(e) => setLiters(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Días" : "Days"}</span>
          <input type="number" step="any" min="1" value={days} onChange={(e) => setDays(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "150 L/día × 30 → 4.500 L" : "150 L/day × 30 → 4,500 L"}</p>
        <p>{es ? "200 L/día × 30 → 6.000 L" : "200 L/day × 30 → 6,000 L"}</p>
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
