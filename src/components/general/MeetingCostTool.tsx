import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Cadence = "once" | "weekly" | "biweekly" | "monthly";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

function parseNum(value: string) {
  const n = Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function money(amount: number, currency: string, locale: Locale) {
  const formatted = amount.toLocaleString(locale === "es" ? "es-AR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${formatted}` : formatted;
}

const PRESETS = [
  { id: "standup", minutes: 15, en: "Standup 15 min", es: "Daily 15 min" },
  { id: "sync", minutes: 30, en: "Sync 30 min", es: "Sync 30 min" },
  { id: "planning", minutes: 60, en: "Planning 1 h", es: "Planning 1 h" },
  { id: "workshop", minutes: 120, en: "Workshop 2 h", es: "Taller 2 h" },
] as const;

export function MeetingCostTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"shared" | "individual">("shared");
  const [attendees, setAttendees] = useState("6");
  const [rate, setRate] = useState("35");
  const [rates, setRates] = useState("35, 35, 50, 28");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("30");
  const [cadence, setCadence] = useState<Cadence>("weekly");
  const [loaded, setLoaded] = useState("1");
  const [currency, setCurrency] = useState("$");
  const [copied, setCopied] = useState(false);
  const [preset, setPreset] = useState("sync");

  const result = useMemo(() => {
    const durationHours = parseNum(hours);
    const durationMinutes = parseNum(minutes);
    const factor = parseNum(loaded);
    if ([durationHours, durationMinutes, factor].some((n) => Number.isNaN(n))) {
      return { error: es ? "Ingresá solo números válidos." : "Enter valid numbers only." };
    }
    if (durationHours < 0 || durationMinutes < 0) {
      return { error: es ? "La duración no puede ser negativa." : "Duration cannot be negative." };
    }
    if (durationMinutes >= 60) {
      return { error: es ? "Los minutos tienen que ser menores a 60. Pasá el resto a horas." : "Minutes must be under 60. Move the rest into hours." };
    }
    if (factor <= 0 || factor > 5) {
      return { error: es ? "El multiplicador tiene que estar entre 0 y 5." : "Multiplier must be between 0 and 5." };
    }
    const length = durationHours + durationMinutes / 60;
    if (length <= 0) {
      return { error: es ? "La reunión tiene que durar más de 0 minutos." : "The meeting must be longer than 0 minutes." };
    }
    if (length > 24) {
      return { error: es ? "La duración no puede superar 24 horas." : "Duration cannot exceed 24 hours." };
    }

    let people = 0;
    let rateSum = 0;
    if (mode === "shared") {
      people = parseNum(attendees);
      const hourly = parseNum(rate);
      if (Number.isNaN(people) || Number.isNaN(hourly)) {
        return { error: es ? "Ingresá asistentes y valor hora válidos." : "Enter a valid attendee count and hourly rate." };
      }
      if (!Number.isInteger(people) || people < 1 || people > 500) {
        return { error: es ? "Los asistentes tienen que ser un entero entre 1 y 500." : "Attendees must be a whole number from 1 to 500." };
      }
      if (hourly < 0) {
        return { error: es ? "El valor hora no puede ser negativo." : "Hourly rate cannot be negative." };
      }
      rateSum = hourly * people;
    } else {
      const parts = rates.split(/[,;\n]+/).map((part) => part.trim()).filter(Boolean);
      if (parts.length === 0) {
        return { error: es ? "Agregá al menos un valor hora." : "Add at least one hourly rate." };
      }
      if (parts.length > 40) {
        return { error: es ? "Como máximo 40 tarifas individuales." : "At most 40 individual rates." };
      }
      const parsed = parts.map(parseNum);
      if (parsed.some((n) => Number.isNaN(n) || n < 0)) {
        return { error: es ? "Cada tarifa tiene que ser un número mayor o igual a 0." : "Each rate must be a number of 0 or more." };
      }
      people = parsed.length;
      rateSum = parsed.reduce((sum, n) => sum + n, 0);
    }

    const meeting = rateSum * length * factor;
    const repeats = cadence === "weekly" ? 52 : cadence === "biweekly" ? 26 : cadence === "monthly" ? 12 : 1;
    return {
      people,
      length,
      meeting,
      perPerson: people > 0 ? meeting / people : 0,
      perMinute: length > 0 ? meeting / (length * 60) : 0,
      yearly: meeting * repeats,
      repeats,
    };
  }, [attendees, cadence, es, hours, loaded, minutes, mode, rate, rates]);

  const summary = useMemo(() => {
    if ("error" in result) return result.error;
    const cadenceLabel =
      cadence === "weekly"
        ? es ? "semanal" : "weekly"
        : cadence === "biweekly"
          ? es ? "cada dos semanas" : "biweekly"
          : cadence === "monthly"
            ? es ? "mensual" : "monthly"
            : es ? "una vez" : "once";
    return [
      `${es ? "Reunión" : "Meeting"}: ${money(result.meeting, currency, locale)}`,
      `${es ? "Por persona" : "Per person"}: ${money(result.perPerson, currency, locale)}`,
      `${es ? "Anual" : "Yearly"} (${cadenceLabel}): ${money(result.yearly, currency, locale)}`,
      `${es ? "Asistentes" : "Attendees"}: ${result.people}`,
    ].join("\n");
  }, [cadence, currency, es, locale, result]);

  function applyPreset(id: string, totalMinutes: number) {
    setPreset(id);
    setHours(String(Math.floor(totalMinutes / 60)));
    setMinutes(String(totalMinutes % 60));
  }

  function reset() {
    setMode("shared");
    setAttendees("6");
    setRate("35");
    setRates("35, 35, 50, 28");
    setHours("0");
    setMinutes("30");
    setCadence("weekly");
    setLoaded("1");
    setCurrency("$");
    setPreset("sync");
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const cadences: { id: Cadence; en: string; es: string }[] = [
    { id: "once", en: "Once", es: "Una vez" },
    { id: "weekly", en: "Weekly", es: "Semanal" },
    { id: "biweekly", en: "Biweekly", es: "Cada dos semanas" },
    { id: "monthly", en: "Monthly", es: "Mensual" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {es
          ? "Estimá cuánto salario quema una reunión según asistentes, valor hora, duración y si se repite."
          : "Estimate the salary a meeting burns from attendees, hourly rates, duration, and whether it repeats."}
      </p>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Duración" : "Duration"}</legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${preset === item.id ? "border-primary bg-accent text-primary" : "bg-background"}`}
              onClick={() => applyPreset(item.id, item.minutes)}
            >
              {es ? item.es : item.en}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">{es ? "Horas" : "Hours"}</span>
            <input className={inputClass} inputMode="decimal" value={hours} onChange={(e) => { setPreset(""); setHours(e.target.value); }} />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">{es ? "Minutos" : "Minutes"}</span>
            <input className={inputClass} inputMode="decimal" value={minutes} onChange={(e) => { setPreset(""); setMinutes(e.target.value); }} />
          </label>
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Tarifas" : "Rates"}</legend>
        <div className="flex flex-wrap gap-2">
          {([
            ["shared", es ? "Misma tarifa" : "Same rate"],
            ["individual", es ? "Tarifas distintas" : "Individual rates"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${mode === id ? "border-primary bg-accent text-primary" : "bg-background"}`}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "shared" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">{es ? "Asistentes" : "Attendees"}</span>
              <input className={inputClass} inputMode="numeric" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">{es ? "Valor hora" : "Hourly rate"}</span>
              <input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
            </label>
          </div>
        ) : (
          <label className="block space-y-1">
            <span className="text-sm font-medium">{es ? "Valores hora separados por coma" : "Hourly rates separated by commas"}</span>
            <input className={inputClass} value={rates} onChange={(e) => setRates(e.target.value)} placeholder={es ? "35, 50, 28" : "35, 50, 28"} />
          </label>
        )}
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Moneda (etiqueta)" : "Currency label"}</span>
          <input className={inputClass} value={currency} maxLength={8} onChange={(e) => setCurrency(e.target.value)} />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Coste cargado (1 = salario)" : "Loaded cost (1 = wage)"}</span>
          <input className={inputClass} inputMode="decimal" value={loaded} onChange={(e) => setLoaded(e.target.value)} />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {[["1", es ? "1x salario" : "1x wage"], ["1.3", es ? "1,3x cargado" : "1.3x loaded"]].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`min-h-11 rounded-full border px-4 text-sm font-medium ${loaded === value ? "border-primary bg-accent text-primary" : "bg-background"}`}
            onClick={() => setLoaded(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Recurrencia" : "Recurrence"}</legend>
        <div className="flex flex-wrap gap-2">
          {cadences.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`min-h-11 rounded-full border px-4 text-sm font-medium ${cadence === item.id ? "border-primary bg-accent text-primary" : "bg-background"}`}
              onClick={() => setCadence(item.id)}
            >
              {es ? item.es : item.en}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="rounded-2xl border bg-accent/40 p-4" aria-live="polite">
        {"error" in result ? (
          <p className="text-sm font-medium text-destructive">{result.error}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Esta reunión" : "This meeting"}</dt>
              <dd className="text-lg font-semibold">{money(result.meeting, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Por persona" : "Per person"}</dt>
              <dd className="text-lg font-semibold">{money(result.perPerson, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Por minuto" : "Per minute"}</dt>
              <dd className="text-lg font-semibold">{money(result.perMinute, currency, locale)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Total anual" : "Yearly total"}</dt>
              <dd className="text-lg font-semibold">{money(result.yearly, currency, locale)}</dd>
            </div>
          </dl>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="min-h-11 w-full rounded-full border px-4 text-sm font-semibold sm:w-auto" onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className="min-h-11 w-full rounded-full border px-4 text-sm font-semibold sm:w-auto" onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}