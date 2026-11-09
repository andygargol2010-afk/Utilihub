import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./OvertimeCalculatorTool.part1";
import { fieldClass, buttonClass } from "./OvertimeCalculatorTool.part2";

export function OvertimeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [regularHours, setRegularHours] = useState("40");
  const [rate, setRate] = useState("20");
  const [otHours, setOtHours] = useState("5");
  const [multiplier, setMultiplier] = useState("1.5");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rh = parseFloat(regularHours);
    const r = parseFloat(rate);
    const oh = parseFloat(otHours);
    const m = parseFloat(multiplier);
    if (!Number.isFinite(rh) || rh < 0 || rh > 168 || !Number.isFinite(r) || r < 0 || r > 1000 || !Number.isFinite(oh) || oh < 0 || oh > 168 || !Number.isFinite(m) || m < 1 || m > 5) return null;
    const regularPay = Math.round(rh * r * 100) / 100;
    const otPay = Math.round(oh * r * m * 100) / 100;
    const total = Math.round((regularPay + otPay) * 100) / 100;
    return { regularPay, otPay, total };
  }, [regularHours, rate, otHours, multiplier]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Pago regular: ${result.regularPay}\nPago extra: ${result.otPay}\nTotal: ${result.total}`
      : `Regular pay: ${result.regularPay}\nOvertime pay: ${result.otPay}\nTotal: ${result.total}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRegularHours("40");
    setRate("20");
    setOtHours("5");
    setMultiplier("1.5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calculadora de horas extra" : "Overtime calculator"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-lg">{es ? `Pago regular: ${result.regularPay}` : `Regular pay: ${result.regularPay}`}</p>
            <p className="text-lg">{es ? `Pago extra: ${result.otPay}` : `Overtime pay: ${result.otPay}`}</p>
            <p className="text-3xl font-semibold">{es ? `Total: ${result.total}` : `Total: ${result.total}`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce valores válidos" : "Enter valid values"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Horas regulares" : "Regular hours"}</span>
        <input
          type="number"
          min="0"
          max="168"
          step="0.5"
          value={regularHours}
          onChange={(e) => setRegularHours(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 40" : "e.g. 40"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Tarifa por hora" : "Hourly rate"}</span>
        <input
          type="number"
          min="0"
          max="1000"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 20" : "e.g. 20"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Horas extra" : "Overtime hours"}</span>
        <input
          type="number"
          min="0"
          max="168"
          step="0.5"
          value={otHours}
          onChange={(e) => setOtHours(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 5" : "e.g. 5"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Multiplicador (ej. 1.5)" : "Multiplier (e.g. 1.5)"}</span>
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 1.5" : "e.g. 1.5"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Calcula el pago regular + horas extra. Útil para nóminas y freelancers."
          : "Calculates regular + overtime pay. Useful for payroll and freelancers."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "40h regulares a 20, 5h extra a 1.5x → Total 950.00" : "40h regular at 20, 5h OT at 1.5x → Total 950.00"}</p>
        <p>{es ? "38h regulares a 15, 8h extra a 2x → Total 810.00" : "38h regular at 15, 8h OT at 2x → Total 810.00"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-interes-simple" : "/tools/calculadora-interes-simple"} className="underline text-primary">
            {es ? "Interés simple" : "Simple interest"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-horas-trabajadas" : "/tools/calculadora-horas-trabajadas"} className="underline text-primary">
            {es ? "Horas trabajadas" : "Hours worked"}
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
