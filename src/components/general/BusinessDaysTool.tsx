import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseHolidays(raw: string): Set<string> {
  const set = new Set<string>();
  raw.split(/\r?\n/).forEach((line) => {
    const t = line.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) set.add(t);
  });
  return set;
}

function countBusinessDays(start: string, end: string, holidays: Set<string>): number {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    const iso = cur.toISOString().slice(0, 10);
    if (day !== 0 && day !== 6 && !holidays.has(iso)) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export function BusinessDaysTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [holidaysRaw, setHolidaysRaw] = useState("");
  const [copied, setCopied] = useState(false);

  const holidays = useMemo(() => parseHolidays(holidaysRaw), [holidaysRaw]);
  const days = useMemo(() => countBusinessDays(start, end, holidays), [start, end, holidays]);
  const valid = start && end && new Date(start) <= new Date(end);

  const result = valid
    ? es
      ? `${days} días hábiles`
      : `${days} business days`
    : es
      ? "Fecha de inicio debe ser anterior o igual a la de fin"
      : "Start date must be on or before end date";

  async function copy() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setStart(today);
    setEnd(today);
    setHolidaysRaw("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Días hábiles" : "Business days"}</p>
        <p className="text-3xl font-semibold">{valid ? days : "—"}</p>
        {!valid && <p className="text-sm text-amber-600">{result}</p>}
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

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Feriados (uno por línea, YYYY-MM-DD)" : "Holidays (one per line, YYYY-MM-DD)"}</span>
        <textarea value={holidaysRaw} onChange={(e) => setHolidaysRaw(e.target.value)} className={fieldClass} rows={4} placeholder="2026-01-01\n2026-12-25" />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!valid}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: 2026-01-01 a 2026-01-10 sin feriados → 7 días hábiles (excl. sáb/dom)" : "Example 1: 2026-01-01 to 2026-01-10 no holidays → 7 business days"}</p>
        <p>{es ? "Ejemplo 2: con feriado 2026-01-01 → 6 días" : "Example 2: with holiday 2026-01-01 → 6 days"}</p>
      </div>
    </div>
  );
}
