import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  computeIsoDuration,
  emptyIsoDuration,
  formatSeconds,
  leasePreset,
  meetingPreset,
  sprintPreset,
  validateIsoDuration,
  type IsoDurationInput,
} from "@/lib/general/iso-duration";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const LABELS: Record<keyof IsoDurationInput, { en: string; es: string }> = {
  years: { en: "Years", es: "Años" },
  months: { en: "Months", es: "Meses" },
  weeks: { en: "Weeks", es: "Semanas" },
  days: { en: "Days", es: "Días" },
  hours: { en: "Hours", es: "Horas" },
  minutes: { en: "Minutes", es: "Minutos" },
  seconds: { en: "Seconds", es: "Segundos" },
};

export function IsoDurationTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<IsoDurationInput>(leasePreset);
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateIsoDuration(draft, es), [draft, es]);
  const result = useMemo(() => (issues.length ? null : computeIsoDuration(draft)), [draft, issues]);

  function patch(partial: Partial<IsoDurationInput>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  const summary = result
    ? es
      ? `Duración ISO ${result.duration}. Segundos aproximados ${formatSeconds(result.approximateSeconds)}. ${result.noteEs}`
      : `ISO duration ${result.duration}. Approximate seconds ${formatSeconds(result.approximateSeconds)}. ${result.note}`
    : "";

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result.duration);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDraft(meetingPreset())}>
          {es ? "Reunión 90 min" : "90-minute meeting"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(sprintPreset())}>
          {es ? "Sprint 2 semanas" : "2-week sprint"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(leasePreset())}>
          {es ? "Ejemplo 1Y2M3DT4H" : "Sample 1Y2M3DT4H"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(emptyIsoDuration())}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(LABELS) as (keyof IsoDurationInput)[]).map((field) => (
          <label key={field} className="block space-y-1 text-sm">
            <span>{es ? LABELS[field].es : LABELS[field].en}</span>
            <input
              className={inputClass}
              inputMode="numeric"
              value={draft[field]}
              onChange={(event) => patch({ [field]: event.target.value })}
              placeholder="0"
            />
          </label>
        ))}
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={`${issue.field}-${issue.message}`}>{issue.message}</li>
          ))}
        </ul>
      ) : result ? (
        <div className="space-y-2 rounded-2xl border p-3">
          <p className="text-sm font-medium">{es ? "Duración ISO 8601" : "ISO 8601 duration"}</p>
          <p className="break-all text-2xl font-semibold">{result.duration}</p>
          <p className="text-sm text-muted-foreground">{es ? result.noteEs : result.note}</p>
          <p className="text-sm">
            {es
              ? `Segundos aproximados: ${formatSeconds(result.approximateSeconds)}.`
              : `Approximate seconds: ${formatSeconds(result.approximateSeconds)}.`}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
