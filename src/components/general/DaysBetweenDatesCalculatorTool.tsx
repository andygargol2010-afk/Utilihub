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

export function DaysBetweenDatesCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-12-31");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const d1 = parseDate(start);
    const d2 = parseDate(end);
    if (!d1 || !d2) return null;
    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const remDays = days % 7;
    return { days, weeks, remDays, from: d1.toLocaleDateString(es ? "es" : "en"), to: d2.toLocaleDateString(es ? "es" : "en") };
  }, [start, end, es]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Días entre fechas: ${result.days} días (${result.weeks} semanas y ${result.remDays} días) de ${result.from} a ${result.to}`
      : `Days between dates: ${result.days} days (${result.weeks} weeks and ${result.remDays} days) from ${result.from} to ${result.to}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setStart("2026-01-01");
    setEnd("2026-12-31");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Días entre fechas" : "Days between dates"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.days} {es ? "días" : "days"}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Elige dos fechas válidas" : "Choose two valid dates"}
          </p>
        )}
        {result && <p className="text-sm text-muted-foreground">{result.weeks} {es ? "semanas y" : "weeks and"} {result.remDays} {es ? "días" : "days"}</p>}
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
        {es ? "Calcula la diferencia absoluta en días calendario entre dos fechas." : "Calculates the absolute calendar day difference between two dates."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2026-01-01 a 2026-12-31 → 364 días" : "2026-01-01 to 2026-12-31 → 364 days"}</p>
        <p>{es ? "2026-03-01 a 2026-03-15 → 14 días" : "2026-03-01 to 2026-03-15 → 14 days"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
