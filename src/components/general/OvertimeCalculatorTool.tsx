import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function OvertimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [hours, setHours] = useState("45");
  const [rate, setRate] = useState("15");
  const [threshold, setThreshold] = useState("40");
  const [multiplier, setMultiplier] = useState("1.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    const t = parseFloat(threshold);
    const m = parseFloat(multiplier);
    if (isNaN(h) || isNaN(r) || isNaN(t) || isNaN(m) || h < 0 || r < 0 || t < 0 || m < 1) return null;
    if (h > 168 || r > 10000 || t > 168 || m > 5) return null;
    const regularHours = Math.min(h, t);
    const overtimeHours = Math.max(0, h - t);
    const regularPay = regularHours * r;
    const overtimePay = overtimeHours * r * m;
    const total = regularPay + overtimePay;
    return {
      regularHours: regularHours.toFixed(2),
      overtimeHours: overtimeHours.toFixed(2),
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      total: total.toFixed(2),
    };
  }, [hours, rate, threshold, multiplier]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Total: ${result.total} | Regular: ${result.regularPay} | Extras: ${result.overtimePay}`
      : `Total: ${result.total} | Regular: ${result.regularPay} | Overtime: ${result.overtimePay}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHours("45");
    setRate("15");
    setThreshold("40");
    setMultiplier("1.5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Pago total" : "Total pay"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.total}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Regular: ${result.regularPay} (${result.regularHours} h) · Extras: ${result.overtimePay} (${result.overtimeHours} h)`
                : `Regular: ${result.regularPay} (${result.regularHours} h) · OT: ${result.overtimePay} (${result.overtimeHours} h)`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores válidos requeridos" : "Valid values required"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Horas trabajadas" : "Hours worked"}</span>
          <input type="number" min="0" max="168" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tarifa por hora" : "Hourly rate"}</span>
          <input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Umbral horas regulares" : "Regular hours threshold"}</span>
          <input type="number" min="0" max="168" value={threshold} onChange={(e) => setThreshold(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Multiplicador extras" : "Overtime multiplier"}</span>
          <input type="number" min="1" max="5" step="0.1" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "45 h, 15/h, umbral 40, ×1.5 → total 712.50" : "45 h, 15/h, threshold 40, ×1.5 → total 712.50"}</p>
        <p>{es ? "50 h, 20/h, umbral 40, ×1.5 → total 1100.00" : "50 h, 20/h, threshold 40, ×1.5 → total 1100.00"}</p>
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
