import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function HoursToDecimalCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("30");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(hours);
    const m = parseFloat(minutes);
    if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || m < 0 || m >= 60 || Math.abs(h) > 1e6) return null;
    const decimal = h + m / 60;
    return {
      decimal: Math.round(decimal * 10000) / 10000,
      hours: h,
      minutes: m,
    };
  }, [hours, minutes]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${result.hours}h ${result.minutes}m = ${result.decimal} horas decimales`
      : `${result.hours}h ${result.minutes}m = ${result.decimal} decimal hours`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setHours("2");
    setMinutes("30");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Horas decimales" : "Decimal hours"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.decimal}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.hours} h ${result.minutes} min`
                : `${result.hours} h ${result.minutes} min`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce horas ≥ 0 y minutos 0-59" : "Enter hours ≥ 0 and minutes 0-59"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Horas" : "Hours"}</span>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 2" : "e.g. 2"}
          min="0"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Minutos" : "Minutes"}</span>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 30" : "e.g. 30"}
          min="0"
          max="59"
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Convierte horas y minutos a horas en formato decimal (útil para nóminas y facturación)."
          : "Convert hours and minutes to decimal hours (useful for payroll and billing)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 h 30 min → 2.5" : "2 h 30 min → 2.5"}</p>
        <p>{es ? "0 h 45 min → 0.75" : "0 h 45 min → 0.75"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-horas-entre-fechas" : "/calculadora-horas-entre-fechas"} className="underline">
            {es ? "Calculadora de horas entre fechas" : "Hours between dates calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-horas-estudio" : "/calculadora-horas-estudio"} className="underline">
            {es ? "Calculadora de horas de estudio" : "Study hours calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
