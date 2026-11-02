import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const COMMON_ZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

function formatInZone(date: Date, zone: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: zone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return null;
  }
}

export function TimezoneConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("America/New_York");
  const [datetime, setDatetime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!datetime) return null;
    const d = new Date(datetime);
    if (isNaN(d.getTime())) return null;
    const fromStr = formatInZone(d, fromZone, es ? "es" : "en");
    const toStr = formatInZone(d, toZone, es ? "es" : "en");
    if (!fromStr || !toStr) return null;
    return { from: fromStr, to: toStr, zoneFrom: fromZone, zoneTo: toZone };
  }, [datetime, fromZone, toZone, es]);

  async function copy() {
    if (!result) return;
    const text = `${result.from} (${result.zoneFrom}) = ${result.to} (${result.zoneTo})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    const now = new Date();
    setDatetime(now.toISOString().slice(0, 16));
    setFromZone("UTC");
    setToZone("America/New_York");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor de zonas horarias" : "Timezone converter"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.to}</p>
            <p className="text-sm text-muted-foreground">{es ? `en ${result.zoneTo}` : `in ${result.zoneTo}`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce una fecha y zonas válidas" : "Enter a valid date and zones"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Desde zona" : "From zone"}</span>
          <select value={fromZone} onChange={(e) => setFromZone(e.target.value)} className={fieldClass}>
            {COMMON_ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A zona" : "To zone"}</span>
          <select value={toZone} onChange={(e) => setToZone(e.target.value)} className={fieldClass}>
            {COMMON_ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha y hora" : "Date and time"}</span>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className={fieldClass}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Convierte una fecha y hora de una zona horaria a otra usando zonas IANA estándar."
          : "Convert a date and time from one time zone to another using standard IANA zones."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "UTC 12:00 → America/New_York 08:00 (aprox. EDT)" : "UTC 12:00 → America/New_York 08:00 (approx. EDT)"}</p>
        <p>{es ? "Europe/Madrid 15:00 → Asia/Tokyo 22:00" : "Europe/Madrid 15:00 → Asia/Tokyo 22:00"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/conversor-timestamp-unix" : "/tools/conversor-timestamp-unix"} className="underline text-primary">
            {es ? "Conversor timestamp Unix" : "Unix timestamp converter"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-edad" : "/tools/calculadora-edad"} className="underline text-primary">
            {es ? "Calculadora de edad" : "Age calculator"}
          </a>
        </p>
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
