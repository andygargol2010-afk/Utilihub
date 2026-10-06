import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  computeWindChill,
  emptyWindChill,
  formatTemp,
  nwsPreset,
  validateWindChill,
  walkPreset,
  type WindChillInput,
} from "@/lib/general/wind-chill";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function WindChillTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<WindChillInput>(walkPreset);
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateWindChill(draft, es), [draft, es]);
  const result = useMemo(() => (issues.length ? null : computeWindChill(draft)), [draft, issues]);

  function patch(partial: Partial<WindChillInput>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  const summary = result
    ? es
      ? `Wind chill ${formatTemp(result.chillC)}°C (${formatTemp(result.chillF)}°F). Aire ${formatTemp(result.airC)}°C, viento ${formatTemp(result.windKmh)} km/h. ${result.noteEs}`
      : `Wind chill ${formatTemp(result.chillF)}°F (${formatTemp(result.chillC)}°C). Air ${formatTemp(result.airF)}°F, wind ${formatTemp(result.windMph)} mph. ${result.note}`
    : "";

  async function copyResult() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDraft(walkPreset())}>
          {es ? "Paseo 0°C / 20 km/h" : "Walk 0°C / 20 km/h"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(nwsPreset())}>
          {es ? "Tabla NWS 0°F / 15 mph" : "NWS chart 0°F / 15 mph"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(emptyWindChill())}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Temperatura del aire" : "Air temperature"}</span>
          <input
            className={inputClass}
            inputMode="decimal"
            value={draft.temperature}
            onChange={(event) => patch({ temperature: event.target.value })}
            placeholder={es ? "ej. -5" : "e.g. -5"}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Unidad de temperatura" : "Temperature unit"}</span>
          <select className={inputClass} value={draft.tempUnit} onChange={(event) => patch({ tempUnit: event.target.value as WindChillInput["tempUnit"] })}>
            <option value="C">°C</option>
            <option value="F">°F</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Velocidad del viento" : "Wind speed"}</span>
          <input
            className={inputClass}
            inputMode="decimal"
            value={draft.wind}
            onChange={(event) => patch({ wind: event.target.value })}
            placeholder={es ? "ej. 20" : "e.g. 20"}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Unidad de viento" : "Wind unit"}</span>
          <select className={inputClass} value={draft.windUnit} onChange={(event) => patch({ windUnit: event.target.value as WindChillInput["windUnit"] })}>
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
          </select>
        </label>
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={issue.field}>{issue.message}</li>
          ))}
        </ul>
      ) : result ? (
        <div className="space-y-2 rounded-2xl border p-3">
          <p className="text-sm font-medium">{es ? "Wind chill NWS" : "NWS wind chill"}</p>
          <p className="text-2xl font-semibold">
            {formatTemp(result.chillC)}°C · {formatTemp(result.chillF)}°F
          </p>
          <p className="text-sm text-muted-foreground">{es ? result.noteEs : result.note}</p>
          <p className="text-sm">{es ? result.frostbiteEs : result.frostbite}</p>
          <p className="text-sm">
            {es
              ? `Equivalencias: aire ${formatTemp(result.airF)}°F, viento ${formatTemp(result.windMph)} mph (${formatTemp(result.windKmh)} km/h).`
              : `Converted inputs: air ${formatTemp(result.airC)}°C, wind ${formatTemp(result.windKmh)} km/h (${formatTemp(result.windMph)} mph).`}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}