import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

function parseNum(value: string) {
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function money(amount: number, currency: string, locale: Locale) {
  const formatted = amount.toLocaleString(locale === "es" ? "es-AR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${formatted}` : formatted;
}

export function OvertimePayTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [rate, setRate] = useState("20");
  const [regular, setRegular] = useState("40");
  const [overtime, setOvertime] = useState("6");
  const [multiplier, setMultiplier] = useState("1.5");
  const [currency, setCurrency] = useState(es ? "$" : "$");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const hourly = parseNum(rate);
    const regularHours = parseNum(regular);
    const overtimeHours = parseNum(overtime);
    const factor = parseNum(multiplier);
    if ([hourly, regularHours, overtimeHours, factor].some((n) => Number.isNaN(n))) {
      return { error: es ? "Ingresá solo números válidos." : "Enter valid numbers only." };
    }
    if (hourly < 0 || regularHours < 0 || overtimeHours < 0) {
      return { error: es ? "Los importes y las horas no pueden ser negativos." : "Rate and hours cannot be negative." };
    }
    if (factor <= 0) {
      return { error: es ? "El multiplicador tiene que ser mayor que 0." : "Multiplier must be greater than 0." };
    }
    if (regularHours + overtimeHours > 168) {
      return { error: es ? "Las horas no pueden superar 168 en una semana." : "Hours cannot exceed 168 in a week." };
    }
    const regularPay = hourly * regularHours;
    const overtimePay = hourly * factor * overtimeHours;
    const total = regularPay + overtimePay;
    const totalHours = regularHours + overtimeHours;
    return {
      regularPay,
      overtimePay,
      total,
      totalHours,
      effective: totalHours > 0 ? total / totalHours : 0,
    };
  }, [currency, es, multiplier, overtime, rate, regular]);

  const summary = useMemo(() => {
    if ("error" in result) return result.error;
    return [
      `${es ? "Pago regular" : "Regular pay"}: ${money(result.regularPay, currency, locale)}`,
      `${es ? "Pago de horas extra" : "Overtime pay"}: ${money(result.overtimePay, currency, locale)}`,
      `${es ? "Total" : "Total"}: ${money(result.total, currency, locale)}`,
      `${es ? "Horas totales" : "Total hours"}: ${result.totalHours}`,
      `${es ? "Valor hora efectivo" : "Effective hourly rate"}: ${money(result.effective, currency, locale)}`,
    ].join("\n");
  }, [currency, es, locale, result]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {es
          ? "Estimá el pago de horas extra con tiempo y medio, doble hora o un multiplicador propio."
          : "Estimate overtime pay with time-and-a-half, double time, or a custom multiplier."}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Valor hora" : "Hourly rate"}</span>
          <input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Moneda (etiqueta)" : "Currency label"}</span>
          <input className={inputClass} value={currency} maxLength={8} onChange={(e) => setCurrency(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Horas normales" : "Regular hours"}</span>
          <input className={inputClass} inputMode="decimal" value={regular} onChange={(e) => setRegular(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Horas extra" : "Overtime hours"}</span>
          <input className={inputClass} inputMode="decimal" value={overtime} onChange={(e) => setOvertime(e.target.value)} />
        </label>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Multiplicador de hora extra" : "Overtime multiplier"}</legend>
        <div className="flex flex-wrap gap-2">
          {[
            ["1.5", es ? "1,5x tiempo y medio" : "1.5x time and a half"],
            ["2", es ? "2x doble hora" : "2x double time"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${multiplier === value ? "border-primary bg-accent text-primary" : "bg-background"}`}
              onClick={() => setMultiplier(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">{es ? "Multiplicador personalizado" : "Custom multiplier"}</span>
          <input className={inputClass} inputMode="decimal" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
        </label>
      </fieldset>
      <div className="rounded-2xl border bg-accent/40 p-4" aria-live="polite">
        {"error" in result ? (
          <p className="text-sm font-medium text-destructive">{result.error}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Pago regular" : "Regular pay"}</dt>
              <dd className="text-lg font-semibold">{money(result.regularPay, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Pago de horas extra" : "Overtime pay"}</dt>
              <dd className="text-lg font-semibold">{money(result.overtimePay, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Total" : "Total"}</dt>
              <dd className="text-lg font-semibold">{money(result.total, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Valor hora efectivo" : "Effective hourly rate"}</dt>
              <dd className="text-lg font-semibold">{money(result.effective, currency, locale)}</dd>
            </div>
          </dl>
        )}
      </div>
      <button type="button" className="min-h-11 rounded-full border px-4 text-sm font-semibold" onClick={copy}>
        {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
      </button>
    </div>
  );
}
