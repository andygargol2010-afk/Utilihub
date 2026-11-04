import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function monthsBetween(start: Date, end: Date): { months: number; days: number } {
  if (start > end) [start, end] = [end, start];
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let temp = new Date(start);
  temp.setMonth(temp.getMonth() + months);
  if (temp > end) {
    months--;
    temp = new Date(start);
    temp.setMonth(temp.getMonth() + months);
  }
  const days = Math.round((end.getTime() - temp.getTime()) / (1000 * 60 * 60 * 24));
  return { months, days };
}

export function MonthsBetweenDatesCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("2026-01-15");
  const [end, setEnd] = useState("2026-06-20");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d1 = parseDate(start);
    const d2 = parseDate(end);
    if (!d1 || !d2) return null;
    const { months, days } = monthsBetween(d1, d2);
    return { months, days, from: d1.toLocaleDateString(es ? "es" : "en"), to: d2.toLocaleDateString(es ? "es" : "en") };
  }, [start, end, es]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Meses entre fechas: ${result.months} meses y ${result.days} días de ${result.from} a ${result.to}`
      : `Months between dates: ${result.months} months and ${result.days} days from ${result.from} to ${result.to}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setStart("2026-01-15");
    setEnd("2026-06-20");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Meses entre fechas" : "Months between dates"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.months} {es ? "meses" : "months"} {result.days > 0 ? `+ ${result.days} ${es ? "días" : "days"}` : ""}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Elige dos fechas válidas" : "Choose two valid dates"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha inicial" : "Start date"}</span>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha final" : "End date"}</span>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Calcula los meses calendario completos y los días restantes entre dos fechas." : "Calculates full calendar months and remaining days between two dates."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2026-01-15 a 2026-06-20 → 5 meses y 5 días" : "2026-01-15 to 2026-06-20 → 5 months and 5 days"}</p>
        <p>{es ? "2026-02-28 a 2026-03-28 → 1 mes" : "2026-02-28 to 2026-03-28 → 1 month"}</p>
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
        {es ? "Relacionado: calculadora-dias-entre-fechas, calculadora-edad" : "Related: calculadora-dias-entre-fechas, calculadora-edad"}
      </p>
    </div>
  );
}
