import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildTypescript, JSON_TS_EXAMPLE } from "@/lib/general/json-to-typescript";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const ISSUE_COPY: Record<string, { en: string; es: string }> = {
  empty: { en: "Paste a JSON sample.", es: "Pegá un JSON de muestra." },
  invalid: { en: "That is not valid JSON.", es: "Eso no es JSON válido." },
  "empty-array": { en: "Empty array. Item type is unknown[].", es: "Array vacío. El ítem queda unknown[]." },
  "empty-object": { en: "Empty object. The interface has no fields.", es: "Objeto vacío. La interfaz no tiene campos." },
};

export function JsonToTypescriptTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(JSON_TS_EXAMPLE);
  const [rootName, setRootName] = useState("Item");
  const [exportTypes, setExportTypes] = useState(true);
  const [nullAsOptional, setNullAsOptional] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => buildTypescript(raw, { rootName, exportTypes, nullAsOptional }),
    [raw, rootName, exportTypes, nullAsOptional],
  );

  async function copy() {
    if (!result.code) return;
    try {
      await navigator.clipboard.writeText(result.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRaw(JSON_TS_EXAMPLE);
    setRootName("Item");
    setExportTypes(true);
    setNullAsOptional(false);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "JSON de muestra" : "JSON sample"}</span>
        <textarea className={fieldClass} rows={8} value={raw} onChange={(event) => setRaw(event.target.value)} spellCheck={false} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Nombre raíz" : "Root name"}</span>
          <input className={fieldClass} value={rootName} onChange={(event) => setRootName(event.target.value)} />
        </label>
        <div className="flex flex-col justify-end gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={exportTypes} onChange={(event) => setExportTypes(event.target.checked)} />
            <span>{es ? "Exportar" : "Export"}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={nullAsOptional} onChange={(event) => setNullAsOptional(event.target.checked)} />
            <span>{es ? "Null como opcional" : "Null as optional"}</span>
          </label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
      {result.issues.length > 0 && (
        <ul className="space-y-1 text-sm">
          {result.issues.map((issue) => (
            <li key={issue.code} className={issue.level === "error" ? "text-destructive" : "text-muted-foreground"}>
              {ISSUE_COPY[issue.code]?.[es ? "es" : "en"] ?? issue.code}
            </li>
          ))}
        </ul>
      )}
      <pre className="overflow-x-auto rounded-xl border bg-muted/40 p-3 text-sm">{result.code || (es ? "Sin interfaz todavía." : "No interface yet.")}</pre>
    </div>
  );
}
