import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (ART)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
];

export function TimezoneTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("America/New_York");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const fromFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: fromTz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const toFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: toTz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return {
        from: fromFormatter.format(d),
        to: toFormatter.format(d),
      };
    } catch {
      return null;
    }
  }, [date, fromTz, toTz]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Desde ${fromTz}: ${result.from}\nHasta ${toTz}: ${result.to}`
      : `From ${fromTz}: ${result.from}\nTo ${toTz}: ${result.to}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setDate(new Date().toISOString().slice(0, 16));
    setFromTz("UTC");
    setToTz("America/New_York");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Hora convertida" : "Converted time"}</p>
        <p className="text-2xl font-semibold">{result ? result.to : "—"}</p>
        <p className="text-xs text-muted-foreground">{toTz}</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha y hora" : "Date and time"}</span>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Desde" : "From"}</span>
          <select value={fromTz} onChange={(e) => setFromTz(e.target.value)} className={fieldClass}>
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Hasta" : "To"}</span>
          <select value={toTz} onChange={(e) => setToTz(e.target.value)} className={fieldClass}>
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultados" : "Copy results"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
