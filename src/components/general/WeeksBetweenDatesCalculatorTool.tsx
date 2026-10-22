import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function WeeksBetweenDatesCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("2026-01-01");
  const [end, setEnd] = useState("2026-02-01");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const diffMs = Math.abs(e.getTime() - s.getTime());
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const rem = days % 7;
    return { weeks, rem, days };
  }, [start, end]);

  async function copy() {
    if (!result) return;
    const text = `${result.weeks} weeks ${result.rem} days`;
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
    setEnd("2026-02-01");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Semanas entre fechas" : "Weeks between dates"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.weeks} {es ? "semanas" : "weeks"} {result.rem} {es ? "días" : "days"}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Fechas válidas" : "Valid dates"}</p>
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
        <p>{es ? "1 ene – 1 feb 2026 → 4 semanas 3 días" : "Jan 1 – Feb 1 2026 → 4 weeks 3 days"}</p>
        <p>{es ? "1 ene – 15 ene → 2 semanas 0 días" : "Jan 1 – Jan 15 → 2 weeks 0 days"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
