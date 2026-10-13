import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono text-sm";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === delimiter) {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        if (row.some((f) => f !== "")) rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    if (row.some((f) => f !== "")) rows.push(row);
  }
  return rows;
}

export function CsvToJsonTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [csv, setCsv] = useState("name,age,city\nAlice,30,New York\nBob,25,\"Los Angeles\"");
  const [delimiter, setDelimiter] = useState(",");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const rows = parseCsv(csv.trim(), delimiter);
      if (rows.length < 2) return { json: "", error: es ? "Necesita al menos encabezado y una fila" : "Need header + at least one row" };
      const headers = rows[0].map((h) => h.trim());
      const objects = rows.slice(1).map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h || `col${i}`] = (row[i] ?? "").trim();
        });
        return obj;
      });
      return { json: JSON.stringify(objects, null, 2), error: "" };
    } catch (e) {
      return { json: "", error: es ? "Error al parsear" : "Parse error" };
    }
  }, [csv, delimiter, es]);

  async function copy() {
    if (!result.json) return;
    try {
      await navigator.clipboard.writeText(result.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setCsv("name,age,city\nAlice,30,New York\nBob,25,\"Los Angeles\"");
    setDelimiter(",");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "CSV" : "CSV"}</span>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={10}
            className={fieldClass}
            placeholder={es ? "Pega tu CSV aquí" : "Paste CSV here"}
          />
        </label>
        <div className="space-y-2 text-sm">
          <span className="font-medium">{es ? "JSON" : "JSON"}</span>
          <pre className="h-[240px] overflow-auto rounded-xl border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap">
            {result.error || result.json || (es ? "Resultado" : "Result")}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span>{es ? "Delimitador" : "Delimiter"}</span>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="rounded-lg border px-2 py-1">
            <option value=",">,</option>
            <option value=";">;</option>
            <option value="\t">Tab</option>
          </select>
        </label>
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result.json}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar JSON" : "Copy JSON"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
