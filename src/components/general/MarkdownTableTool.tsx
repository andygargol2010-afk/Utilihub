import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  buildMarkdownTable,
  MARKDOWN_TABLE_EXAMPLE,
  type AlignChoice,
  type DelimiterChoice,
} from "@/lib/general/markdown-table";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const ISSUE_COPY: Record<string, { en: string; es: string }> = {
  empty: { en: "Paste at least one row.", es: "Pegá al menos una fila." },
  "one-column": { en: "Only one column detected. Check the delimiter.", es: "Solo se detectó una columna. Revisá el delimitador." },
  uneven: { en: "Some rows have fewer cells. Empty cells were added.", es: "Algunas filas tienen menos celdas. Se agregaron celdas vacías." },
  "header-only": { en: "Header only. The table has no body rows.", es: "Solo encabezado. La tabla no tiene filas de cuerpo." },
};

export function MarkdownTableTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [csv, setCsv] = useState(MARKDOWN_TABLE_EXAMPLE.csv);
  const [delimiter, setDelimiter] = useState<DelimiterChoice>("auto");
  const [header, setHeader] = useState(true);
  const [align, setAlign] = useState<AlignChoice>("left");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => buildMarkdownTable(csv, { delimiter, header, align }), [csv, delimiter, header, align]);
  const delimiterLabel = result.delimiter === "\t" ? "tab" : result.delimiter;

  async function copy() {
    if (!result.markdown) return;
    try {
      await navigator.clipboard.writeText(result.markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCsv(MARKDOWN_TABLE_EXAMPLE.csv);
    setDelimiter("auto");
    setHeader(true);
    setAlign("left");
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "CSV o texto delimitado" : "CSV or delimited text"}</span>
        <textarea
          className={fieldClass}
          rows={6}
          value={csv}
          onChange={(event) => setCsv(event.target.value)}
          spellCheck={false}
          aria-label={es ? "Texto CSV" : "CSV text"}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Delimitador" : "Delimiter"}</span>
          <select className={fieldClass} value={delimiter} onChange={(event) => setDelimiter(event.target.value as DelimiterChoice)} aria-label={es ? "Delimitador" : "Delimiter"}>
            <option value="auto">{es ? "Automático" : "Auto"}</option>
            <option value="comma">{es ? "Coma" : "Comma"}</option>
            <option value="semicolon">{es ? "Punto y coma" : "Semicolon"}</option>
            <option value="tab">Tab</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Alineación" : "Alignment"}</span>
          <select className={fieldClass} value={align} onChange={(event) => setAlign(event.target.value as AlignChoice)} aria-label={es ? "Alineación" : "Alignment"}>
            <option value="left">{es ? "Izquierda" : "Left"}</option>
            <option value="center">{es ? "Centro" : "Center"}</option>
            <option value="right">{es ? "Derecha" : "Right"}</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-3 text-sm">
          <input type="checkbox" checked={header} onChange={(event) => setHeader(event.target.checked)} aria-label={es ? "Primera fila es encabezado" : "First row is a header"} />
          <span>{es ? "Primera fila es encabezado" : "First row is a header"}</span>
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        {es
          ? `${result.rows} filas · ${result.columns} columnas · delimitador ${delimiterLabel}`
          : `${result.rows} rows · ${result.columns} columns · delimiter ${delimiterLabel}`}
      </p>
      {result.issues.length > 0 ? (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {result.issues.map((issue) => (
            <li key={issue.code}>{es ? ISSUE_COPY[issue.code].es : ISSUE_COPY[issue.code].en}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{es ? "Sin avisos. No se sube el texto." : "No warnings. Text is not uploaded."}</p>
      )}
      <pre className="overflow-x-auto rounded-xl border border-border p-4 text-sm">{result.markdown || (es ? "Nada para copiar." : "Nothing to copy.")}</pre>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={copy}>{copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar tabla" : "Copy table")}</button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Restablecer" : "Reset"}</button>
      </div>
    </div>
  );
}
