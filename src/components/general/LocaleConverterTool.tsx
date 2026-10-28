import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  LOCALE_PRESETS,
  defaultLocaleInput,
  describeSeparator,
  formatForLocale,
  validateLocaleInput,
  type LocaleFormatInput,
} from "@/lib/general/locale-format";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-9 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function LocaleConverterTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<LocaleFormatInput>(defaultLocaleInput);
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateLocaleInput(draft, es), [draft, es]);
  const result = useMemo(
    () => (issues.length ? null : formatForLocale(draft, es ? "es" : "en")),
    [draft, issues, es],
  );

  function patch(partial: Partial<LocaleFormatInput>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  const rows = result
    ? [
        { label: es ? "Fecha completa" : "Full date", value: result.dateFull },
        { label: es ? "Fecha corta" : "Short date", value: result.dateShort },
        { label: es ? "Fecha y hora" : "Date and time", value: result.dateTime },
        { label: es ? "Número" : "Number", value: result.number },
        { label: es ? "Porcentaje (número ÷ 100)" : "Percent (number ÷ 100)", value: result.percent },
        { label: es ? "Compacto" : "Compact", value: result.compact },
        { label: es ? "Moneda" : "Currency", value: result.currency },
      ]
    : [];

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(rows.map((row) => `${row.label}: ${row.value}`).join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LOCALE_PRESETS.map((preset) => (
          <button
            key={preset.tag}
            type="button"
            className={buttonClass}
            aria-pressed={draft.locale === preset.tag}
            title={es ? preset.es : preset.en}
            onClick={() => patch({ locale: preset.tag })}
          >
            {preset.tag}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Locale (etiqueta BCP 47)" : "Locale (BCP 47 tag)"}</span>
          <input
            className={inputClass}
            value={draft.locale}
            onChange={(event) => patch({ locale: event.target.value })}
            placeholder="es-MX"
            autoCapitalize="off"
            spellCheck={false}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Fecha y hora" : "Date and time"}</span>
          <input
            className={inputClass}
            type="datetime-local"
            value={draft.date}
            onChange={(event) => patch({ date: event.target.value })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Número" : "Number"}</span>
          <input
            className={inputClass}
            inputMode="decimal"
            value={draft.number}
            onChange={(event) => patch({ number: event.target.value })}
            placeholder="1234567.89"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Moneda (ISO 4217)" : "Currency (ISO 4217)"}</span>
          <input
            className={inputClass}
            value={draft.currency}
            onChange={(event) => patch({ currency: event.target.value.toUpperCase() })}
            placeholder="EUR"
            maxLength={3}
            autoCapitalize="characters"
            spellCheck={false}
          />
        </label>
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={`${issue.field}-${issue.message}`}>{issue.message}</li>
          ))}
        </ul>
      ) : result ? (
        <div className="space-y-3 rounded-2xl border p-3">
          <p className="text-sm font-medium">
            {result.canonical} — {result.displayName}
          </p>
          <dl className="grid gap-2 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="rounded-xl bg-muted/40 p-2">
                <dt className="text-xs text-muted-foreground">{row.label}</dt>
                <dd className="break-words text-lg font-semibold">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted-foreground">
            {es
              ? `Separador decimal: ${describeSeparator(result.decimalSeparator, true)}. Separador de miles: ${describeSeparator(result.groupSeparator, true)}.`
              : `Decimal separator: ${describeSeparator(result.decimalSeparator, false)}. Thousands separator: ${describeSeparator(result.groupSeparator, false)}.`}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar todo" : "Copy all"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
