import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function DateDifferenceTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-01-31");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const diffMs = e.getTime() - s.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const absDays = Math.abs(days);
    const weeks = Math.floor(absDays / 7);
    const remDays = absDays % 7;
    const months = Math.round(absDays / 30.44);
    return { days, absDays, weeks, remDays, months, negative: days < 0 };
  }, [start, end]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Diferencia: ${result.days} días (${result.weeks} semanas y ${result.remDays} días)`
      : `Difference: ${result.days} days (${result.weeks} weeks and ${result.remDays} days)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setStart("2026-01-01");
    setEnd("2026-01-31");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Diferencia entre fechas" : "Date difference"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.days} {es ? "días" : "days"}</p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `${result.weeks} semanas y ${result.remDays} días · ~${result.months} meses`
                : `${result.weeks} weeks and ${result.remDays} days · ~${result.months} months`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Fechas inválidas" : "Invalid dates"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha inicio" : "Start date"}</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Fecha fin" : "End date"}</span>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 ene 2026 a 31 ene 2026 = 30 días" : "Jan 1 2026 to Jan 31 2026 = 30 days"}</p>
        <p>{es ? "1 ene 2024 a 1 ene 2025 = 366 días (año bisiesto)" : "Jan 1 2024 to Jan 1 2025 = 366 days (leap year)"}</p>
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
