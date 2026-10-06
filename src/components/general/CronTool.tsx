import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  emptyCron,
  every15Preset,
  hourlyPreset,
  issueText,
  joinCron,
  previewCron,
  splitCron,
  validateCron,
  weekdayPreset,
  type CronFields,
} from "@/lib/general/cron";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base font-mono";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const LABELS: Record<Locale, Record<keyof CronFields, string>> = {
  en: { minute: "Minute", hour: "Hour", dayOfMonth: "Day of month", month: "Month", dayOfWeek: "Day of week" },
  es: { minute: "Minuto", hour: "Hora", dayOfMonth: "Día del mes", month: "Mes", dayOfWeek: "Día de la semana" },
};

export function CronTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<CronFields>(every15Preset());
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateCron(draft), [draft]);
  const result = useMemo(() => (issues.length ? null : previewCron(draft, new Date(), es)), [draft, issues, es]);

  function patch(partial: Partial<CronFields>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  function applyExpression(value: string) {
    const parsed = splitCron(value);
    if (parsed) setDraft(parsed);
    else {
      const parts = value.trim().split(/\s+/);
      setDraft({
        minute: parts[0] ?? "",
        hour: parts[1] ?? "",
        dayOfMonth: parts[2] ?? "",
        month: parts[3] ?? "",
        dayOfWeek: parts.slice(4).join(" "),
      });
    }
  }

  async function copyResult() {
    const line = result?.expression ?? joinCron(draft);
    if (!line.trim()) return;
    await navigator.clipboard.writeText(line);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDraft(every15Preset())}>
          {es ? "Cada 15 min" : "Every 15 min"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(weekdayPreset())}>
          {es ? "Lun–vie 08:30" : "Weekdays 08:30"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(hourlyPreset())}>
          {es ? "Cada hora" : "Hourly"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(emptyCron())}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Expresión (5 campos)" : "Expression (5 fields)"}</span>
        <input className={inputClass} value={joinCron(draft)} onChange={(event) => applyExpression(event.target.value)} spellCheck={false} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(LABELS.en) as (keyof CronFields)[]).map((key) => (
          <label key={key} className="block space-y-1 text-sm">
            <span>{LABELS[es ? "es" : "en"][key]}</span>
            <input className={inputClass} value={draft[key]} onChange={(event) => patch({ [key]: event.target.value })} spellCheck={false} />
          </label>
        ))}
      </div>

      {issues.length > 0 && (
        <ul className="space-y-1 text-sm text-destructive">
          {issues.map((issue) => (
            <li key={`${issue.field}-${issue.message}`}>{issueText(issue, es)}</li>
          ))}
        </ul>
      )}

      {result && (
        <div className="space-y-3 rounded-2xl border p-4">
          <p className="font-mono text-sm">{result.expression}</p>
          <p className="text-sm">{result.summary}</p>
          <div>
            <p className="text-sm font-medium">{es ? "Próximas ejecuciones locales" : "Next local runs"}</p>
            <ul className="mt-1 space-y-1 font-mono text-sm">
              {result.next.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar expresión" : "Copy expression"}
          </button>
        </div>
      )}
    </div>
  );
}
