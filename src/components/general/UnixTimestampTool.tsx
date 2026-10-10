import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { timestampToDate, dateToTimestamp, UNIX_SAMPLE_TS, UNIX_SAMPLE_ISO } from "@/lib/general/unix-timestamp";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function UnixTimestampTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [tsInput, setTsInput] = useState(UNIX_SAMPLE_TS);
  const [dateInput, setDateInput] = useState(UNIX_SAMPLE_ISO.slice(0, 16));
  const [copied, setCopied] = useState("");

  const fromTs = useMemo(() => timestampToDate(tsInput), [tsInput]);
  const fromDate = useMemo(() => dateToTimestamp(dateInput), [dateInput]);

  const now = useMemo(() => new Date(), []);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium">{es ? "Ahora" : "Now"}</p>
        <p className="mt-1 text-lg">{now.toLocaleString(es ? "es" : "en")}</p>
        <p className="text-sm text-muted-foreground">
          {es ? "Timestamp (s):" : "Timestamp (s):"} {Math.floor(now.getTime() / 1000)}
        </p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Timestamp (segundos o ms)" : "Timestamp (seconds or ms)"}</span>
        <input
          className={fieldClass}
          value={tsInput}
          onChange={(e) => setTsInput(e.target.value)}
          placeholder="1700000000"
          inputMode="numeric"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setTsInput(UNIX_SAMPLE_TS)}>
          {es ? "Ejemplo" : "Example"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => fromTs && copy(fromTs.toISOString(), "iso")}
          disabled={!fromTs}
        >
          {copied === "iso" ? (es ? "Copiado" : "Copied") : es ? "Copiar ISO" : "Copy ISO"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setTsInput("")}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      {fromTs ? (
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">{es ? "Fecha local" : "Local date"}</p>
          <p className="text-xl font-semibold">{fromTs.toLocaleString(es ? "es" : "en")}</p>
          <p className="mt-1 text-sm">{fromTs.toISOString()}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {es ? "Timestamp inválido." : "Invalid timestamp."}
        </p>
      )}

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Fecha (local o ISO)" : "Date (local or ISO)"}</span>
        <input
          className={fieldClass}
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => setDateInput(new Date().toISOString().slice(0, 16))}
        >
          {es ? "Ahora" : "Now"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => fromDate !== null && copy(String(fromDate), "ts")}
          disabled={fromDate === null}
        >
          {copied === "ts" ? (es ? "Copiado" : "Copied") : es ? "Copiar timestamp" : "Copy timestamp"}
        </button>
      </div>
      {fromDate !== null ? (
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">{es ? "Timestamp (segundos)" : "Timestamp (seconds)"}</p>
          <p className="text-xl font-semibold">{fromDate}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {es ? "En milisegundos:" : "In milliseconds:"} {fromDate * 1000}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{es ? "Fecha inválida." : "Invalid date."}</p>
      )}
    </div>
  );
}
