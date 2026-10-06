import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  allDayPreset,
  buildIcs,
  emptyIcsInput,
  exclusiveAllDayEnd,
  meetingPreset,
  validateIcs,
  weeklyPreset,
  type IcsInput,
} from "@/lib/general/ics-event";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const PRESETS: { id: string; label: string; labelEs: string; draft: () => IcsInput }[] = [
  { id: "meeting", label: "1.5 h meeting", labelEs: "Reunión de 1,5 h", draft: meetingPreset },
  { id: "day", label: "All-day marker", labelEs: "Día completo", draft: allDayPreset },
  { id: "weekly", label: "Weekly standup", labelEs: "Standup semanal", draft: weeklyPreset },
];

export function IcsEventTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<IcsInput>(meetingPreset);
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateIcs(draft, es), [draft, es]);
  const file = useMemo(() => (issues.length ? "" : buildIcs(draft)), [draft, issues]);

  function patch(partial: Partial<IcsInput>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function copyFile() {
    if (!file) return;
    await navigator.clipboard.writeText(file);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadFile() {
    if (!file) return;
    const blob = new Blob([file], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "evento.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" className={buttonClass} onClick={() => setDraft(preset.draft())}>
            {es ? preset.labelEs : preset.label}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => setDraft(emptyIcsInput())}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Título" : "Title"}</span>
        <input className={inputClass} value={draft.title} onChange={(event) => patch({ title: event.target.value })} placeholder={es ? "Revisión de producto" : "Product review"} />
      </label>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Descripción" : "Description"}</span>
        <textarea className="min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-base" value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
      </label>

      <label className="block space-y-1 text-sm">
        <span>{es ? "Lugar" : "Location"}</span>
        <input className={inputClass} value={draft.location} onChange={(event) => patch({ location: event.target.value })} />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.allDay}
          onChange={(event) => {
            const allDay = event.target.checked;
            patch({
              allDay,
              endDate: allDay && draft.startDate && draft.endDate === draft.startDate ? exclusiveAllDayEnd(draft.startDate) : draft.endDate,
            });
          }}
        />
        <span>{es ? "Todo el día (el fin es exclusivo)" : "All day (end date is exclusive)"}</span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Inicio" : "Start date"}</span>
          <input className={inputClass} type="date" value={draft.startDate} onChange={(event) => patch({ startDate: event.target.value })} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Fin exclusivo" : "End date"}</span>
          <input className={inputClass} type="date" value={draft.endDate} onChange={(event) => patch({ endDate: event.target.value })} />
        </label>
        {draft.allDay ? null : (
          <>
            <label className="block space-y-1 text-sm">
              <span>{es ? "Hora de inicio" : "Start time"}</span>
              <input className={inputClass} type="time" value={draft.startTime} onChange={(event) => patch({ startTime: event.target.value })} />
            </label>
            <label className="block space-y-1 text-sm">
              <span>{es ? "Hora de fin" : "End time"}</span>
              <input className={inputClass} type="time" value={draft.endTime} onChange={(event) => patch({ endTime: event.target.value })} />
            </label>
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Zona" : "Time zone"}</span>
          <select className={inputClass} value={draft.timezone} onChange={(event) => patch({ timezone: event.target.value as IcsInput["timezone"] })} disabled={draft.allDay}>
            <option value="floating">{es ? "Flotante (sin Z)" : "Floating (no Z)"}</option>
            <option value="utc">UTC</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Ocurrencias semanales" : "Weekly occurrences"}</span>
          <input className={inputClass} inputMode="numeric" value={draft.weeklyCount} onChange={(event) => patch({ weeklyCount: event.target.value })} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Aviso (minutos)" : "Reminder (minutes)"}</span>
          <input className={inputClass} inputMode="numeric" value={draft.reminderMinutes} onChange={(event) => patch({ reminderMinutes: event.target.value })} placeholder={es ? "vacío = sin aviso" : "empty = none"} />
        </label>
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={issue.field}>{issue.message}</li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2 rounded-2xl border p-3">
          <p className="text-sm font-medium">{es ? "Archivo listo para importar" : "File ready to import"}</p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-muted p-3 text-sm">{file}</pre>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={copyFile}>
              {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
            </button>
            <button type="button" className={buttonClass} onClick={downloadFile}>
              {es ? "Descargar .ics" : "Download .ics"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
