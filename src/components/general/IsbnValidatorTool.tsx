import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { analyzeIsbn, validateIsbn } from "@/lib/general/isbn";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function IsbnValidatorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState("978-0-306-40615-7");
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateIsbn(raw, es), [raw, es]);
  const result = useMemo(() => (issues.length ? null : analyzeIsbn(raw)), [issues, raw]);

  async function copySummary() {
    if (!result) return;
    const lines = [
      result.valid
        ? es
          ? `Válido ${result.kind.toUpperCase()}: ${result.compact}`
          : `Valid ${result.kind.toUpperCase()}: ${result.compact}`
        : es
          ? `Inválido. Control esperado ${result.expectedCheck}, recibido ${result.actualCheck}`
          : `Invalid. Expected check ${result.expectedCheck}, got ${result.actualCheck}`,
      `ISBN-13: ${result.isbn13}`,
      result.isbn10 ? `ISBN-10: ${result.isbn10}` : es ? "ISBN-10: no aplica (prefijo 979)" : "ISBN-10: not available (979 prefix)",
      result.hyphenated ? (es ? `Con guiones: ${result.hyphenated}` : `Hyphenated: ${result.hyphenated}`) : "",
    ].filter(Boolean);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setRaw("978-0-306-40615-7")}>
          {es ? "ISBN-13 de ejemplo" : "Sample ISBN-13"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw("0-306-40615-2")}>
          {es ? "ISBN-10 de ejemplo" : "Sample ISBN-10"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw("9780306406158")}>
          {es ? "Dígito mal" : "Bad check digit"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw("")}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <label className="block space-y-1 text-sm">
        <span>ISBN</span>
        <input
          className={inputClass}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          placeholder="978-0-306-40615-7"
          inputMode="text"
          autoCapitalize="characters"
        />
      </label>
      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={issue.field}>{issue.message}</li>
          ))}
        </ul>
      ) : result ? (
        <div className="space-y-2 rounded-2xl border p-3">
          <p className="text-sm font-medium">
            {result.valid
              ? es
                ? `Válido (${result.kind})`
                : `Valid (${result.kind})`
              : es
                ? `Inválido: se esperaba ${result.expectedCheck} y llegó ${result.actualCheck}`
                : `Invalid: expected ${result.expectedCheck}, got ${result.actualCheck}`}
          </p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-muted p-2">
              <dt className="text-xs text-muted-foreground">ISBN-13</dt>
              <dd className="font-medium">{result.isbn13}</dd>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <dt className="text-xs text-muted-foreground">ISBN-10</dt>
              <dd className="font-medium">{result.isbn10 ?? (es ? "No aplica" : "Not available")}</dd>
            </div>
            <div className="rounded-xl bg-muted p-2 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">{es ? "Con guiones (grupos 0 y 1)" : "Hyphenated (groups 0 and 1)"}</dt>
              <dd className="font-medium">{result.hyphenated ?? (es ? "Grupo sin tabla de editorial" : "Group has no publisher table here")}</dd>
            </div>
          </dl>
          <button type="button" className={buttonClass} onClick={copySummary}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resumen" : "Copy summary"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
