import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function HoursBetweenDatesCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("2026-10-22T09:00");
  const [end, setEnd] = useState("2026-10-22T17:00");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const diffMs = e.getTime() - s.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    if (Math.abs(hours) > 1e6) return null;
    return { hours: hours.toFixed(2) };
  }, [start, end]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.hours);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setStart("2026-10-22T09:00");
    setEnd("2026-10-22T17:00");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Horas entre fechas" : "Hours between dates"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.hours}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Fechas válidas requeridas" : "Valid dates required"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha y hora inicio" : "Start date & time"}</span>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha y hora fin" : "End date & time"}</span>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Diferencia en horas (puede ser negativa)" : "Difference in hours (can be negative)"}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "09:00 a 17:00 el mismo día → 8.00" : "09:00 to 17:00 same day → 8.00"}</p>
        <p>{es ? "22 Oct 09:00 a 23 Oct 09:00 → 24.00" : "22 Oct 09:00 to 23 Oct 09:00 → 24.00"}</p>
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
