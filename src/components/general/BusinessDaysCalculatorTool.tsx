import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function countBusinessDays(start: Date, end: Date): number {
  if (end < start) return 0;
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function BusinessDaysCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [start, setStart] = useState("2026-10-01");
  const [end, setEnd] = useState("2026-10-31");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
    const days = countBusinessDays(s, e);
    return { days };
  }, [start, end]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(String(result.days));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setStart("2026-10-01");
    setEnd("2026-10-31");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Días hábiles" : "Business days"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.days}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Fechas válidas requeridas" : "Valid dates required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha inicio" : "Start date"}</span>
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha fin" : "End date"}</span>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass} />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Cuenta lunes a viernes entre las fechas (inclusive). No excluye feriados." : "Counts Monday–Friday between dates (inclusive). Does not exclude holidays."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1–31 oct 2026 → 22 días hábiles" : "1–31 Oct 2026 → 22 business days"}</p>
        <p>{es ? "1–7 ene 2026 → 5 días hábiles" : "1–7 Jan 2026 → 5 business days"}</p>
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
