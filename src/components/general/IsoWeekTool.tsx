import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { ISO_WEEK_SAMPLE_DATE, ISO_WEEK_SAMPLE_WEEK, dateToIsoWeek, isoWeekToDate } from "@/lib/general/iso-week";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function IsoWeekTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [date, setDate] = useState(ISO_WEEK_SAMPLE_DATE);
  const [week, setWeek] = useState(ISO_WEEK_SAMPLE_WEEK);
  const [copied, setCopied] = useState<"" | "date" | "week">("");
  const fromDate = useMemo(() => dateToIsoWeek(date), [date]);
  const fromWeek = useMemo(() => isoWeekToDate(week), [week]);

  async function copyResult(kind: "date" | "week") {
    const value = kind === "date" ? fromDate.label : fromWeek.label;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  const dateStatus =
    fromDate.status === "empty"
      ? es
        ? "La fecha está vacía. No se inventa una semana."
        : "The date is empty. No week is invented."
      : fromDate.status === "invalid"
        ? es
          ? "La fecha no es un día real. No se inventa una semana."
          : "The date is not a real day. No week is invented."
        : es
          ? "Semana ISO lista. El año-semana puede no coincidir con el año calendario."
          : "ISO week ready. The week-year may differ from the calendar year.";

  const weekStatus =
    fromWeek.status === "empty"
      ? es
        ? "La semana está vacía. No se inventa una fecha."
        : "The week is empty. No date is invented."
      : fromWeek.error === "range"
        ? es
          ? "Esa semana no existe en ese año. No se inventa una fecha."
          : "That week does not exist in that year. No date is invented."
        : fromWeek.status === "invalid"
          ? es
            ? "Usá el formato YYYY-Www-D, con D de 1 (lunes) a 7 (domingo)."
            : "Use YYYY-Www-D, with D from 1 (Monday) to 7 (Sunday)."
          : es
            ? "Fecha lista. No se movió el día a otra semana."
            : "Date ready. The day was not moved to another week.";

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha calendario" : "Calendar date"}</span>
        <input
          className={fieldClass}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          placeholder="2021-01-01"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Semana ISO" : "ISO week"}</span>
        <input
          className={fieldClass}
          value={week}
          onChange={(event) => setWeek(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="2024-W01-1"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDate(ISO_WEEK_SAMPLE_DATE);
            setWeek("");
          }}
        >
          {es ? "Ejemplo fecha" : "Date example"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDate("");
            setWeek(ISO_WEEK_SAMPLE_WEEK);
          }}
        >
          {es ? "Ejemplo semana" : "Week example"}
        </button>
        <button type="button" className={buttonClass} onClick={() => copyResult("date")} disabled={fromDate.status !== "ok"}>
          {copied === "date" ? (es ? "Copiado" : "Copied") : es ? "Copiar semana" : "Copy week"}
        </button>
        <button type="button" className={buttonClass} onClick={() => copyResult("week")} disabled={fromWeek.status !== "ok"}>
          {copied === "week" ? (es ? "Copiado" : "Copied") : es ? "Copiar fecha" : "Copy date"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDate("");
            setWeek("");
          }}
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{dateStatus}</p>
        {fromDate.status === "ok" ? <p className="mt-3 break-all font-mono text-base">{fromDate.label}</p> : null}
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{weekStatus}</p>
        {fromWeek.status === "ok" ? <p className="mt-3 break-all font-mono text-base">{fromWeek.label}</p> : null}
      </div>
    </div>
  );
}
