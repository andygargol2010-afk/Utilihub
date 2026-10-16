import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function normalize(text: string, options: { trim: boolean; collapse: boolean; emptyLines: boolean }): string {
  let out = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (options.emptyLines) out = out.replace(/\n{2,}/g, "\n");
  if (options.collapse) out = out.replace(/[ \t]+/g, " ");
  if (options.trim) {
    out = out.split("\n").map((l) => l.trim()).join("\n").trim();
  }
  return out;
}

export function TextNormalizerTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("  Hello   world  \n\n\n  Foo\tbar  ");
  const [trim, setTrim] = useState(true);
  const [collapse, setCollapse] = useState(true);
  const [emptyLines, setEmptyLines] = useState(true);
  const [copied, setCopied] = useState(false);

  const output = normalize(input, { trim, collapse, emptyLines });

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setInput("  Hello   world  \n\n\n  Foo\tbar  ");
    setTrim(true);
    setCollapse(true);
    setEmptyLines(true);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Texto de entrada" : "Input text"}</span>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} rows={6} />
        </label>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} />
            {es ? "Recortar espacios" : "Trim spaces"}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={collapse} onChange={(e) => setCollapse(e.target.checked)} />
            {es ? "Colapsar espacios" : "Collapse spaces"}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={emptyLines} onChange={(e) => setEmptyLines(e.target.checked)} />
            {es ? "Quitar líneas vacías" : "Remove empty lines"}
          </label>
        </div>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Texto normalizado" : "Normalized text"}</span>
          <textarea value={output} readOnly className={fieldClass} rows={6} />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: texto con espacios extra y líneas vacías → una sola línea limpia" : "Example 1: extra spaces and empty lines → clean single line"}</p>
        <p>{es ? "Ejemplo 2: múltiples espacios y tabs → espacios simples" : "Example 2: multiple spaces and tabs → single spaces"}</p>
      </div>
    </div>
  );
}
