import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { runDevTool } from "@/lib/general/dev-extra-runner";
import type { CsvSeparator } from "@/lib/general/dev-extra-engines";
import type { XmlEscapeContext } from "@/lib/general/dev-extra-engines";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 font-mono text-sm";
const textareaClass = "min-h-48 w-full rounded-xl border bg-background p-4 font-mono text-sm";
const labelClass = "space-y-1";

function Field({ label, value, onChange, placeholder, textarea = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; textarea?: boolean }) {
  return <label className={labelClass}><span className="text-sm font-medium">{label}</span>{textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} className={textareaClass} placeholder={placeholder} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} placeholder={placeholder} />}</label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-3 rounded-xl border p-3 text-sm"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4" /><span>{label}</span></label>;
}

export function DevAdvancedTool({ tool }: { tool: GeneralTool }) {
  const [input, setInput] = useState("");
  const [second, setSecond] = useState("");
  const [flags, setFlags] = useState("");
  const [replacement, setReplacement] = useState("");
  const [separator, setSeparator] = useState<CsvSeparator>("comma");
  const [xmlContext, setXmlContext] = useState<XmlEscapeContext>("content");
  const [jsonIndented, setJsonIndented] = useState(false);
  const [firstRowIsHeader, setFirstRowIsHeader] = useState(true);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [jwtTimes, setJwtTimes] = useState<ReturnType<typeof runDevTool>["jwtTimes"]>([]);
  const [jwtHeader, setJwtHeader] = useState<ReturnType<typeof runDevTool>["jwtHeader"]>({});
  const isRegex = tool.slug === "regex-replace" || tool.slug === "regex-split" || tool.slug === "regex-match-extractor";
  const isCsv = tool.slug === "csv-to-json" || tool.slug === "csv-validator" || tool.slug === "html-table-generator";

  const execute = () => {
    try {
      const result = runDevTool(tool.slug, { input, second, flags, replacement, separator, xmlContext, jsonIndented, firstRowIsHeader });
      setError(""); setOutput(result.output); setJwtTimes(result.jwtTimes); setJwtHeader(result.jwtHeader);
    } catch (errorValue) {
      setOutput(""); setJwtTimes([]); setJwtHeader({}); setError(errorValue instanceof Error ? errorValue.message : "Entrada inválida.");
    }
  };

  const copy = () => { if (output) void navigator.clipboard?.writeText(output); };

  return <div className="space-y-4">
    {tool.slug === "json-stringify" && <div className="flex flex-wrap gap-3"><Toggle label="JSON Indentado (2 espacios)" checked={jsonIndented} onChange={setJsonIndented} /><span className="self-center text-xs text-muted-foreground">Desactivado = JSON compacto en una sola línea.</span></div>}
    {isRegex ? <div className="grid gap-4 md:grid-cols-2"><Field label="Expresión Regular (Patrón)" value={input} onChange={setInput} placeholder="\\b[A-Z][a-z]+\\b" /><Field label="Texto de Entrada" value={second} onChange={setSecond} placeholder="Texto sobre el que ejecutar la expresión…" textarea /><Field label="Banderas / Flags" value={flags} onChange={setFlags} placeholder="gim" />{tool.slug === "regex-replace" && <Field label="Texto de Reemplazo" value={replacement} onChange={setReplacement} placeholder="$1 o texto de reemplazo" textarea />}</div> : <div className="grid gap-4 md:grid-cols-2"><Field label={tool.slug === "json-path" ? "Documento JSON" : "Entrada principal"} value={input} onChange={setInput} placeholder={tool.slug.startsWith("json") ? "Pega JSON válido…" : "Pega el contenido que quieras procesar…"} textarea />{tool.slug === "json-path" && <Field label="Ruta JSON" value={second} onChange={setSecond} placeholder="$.usuarios[?(@.edad >= 18 && @.activo == true)].nombre" />}{tool.slug === "json-diff" && <Field label="Segundo documento JSON" value={second} onChange={setSecond} placeholder="Pega el segundo JSON…" textarea />}{isCsv && <label className={labelClass}><span className="text-sm font-medium">Separador</span><select value={separator} onChange={(event) => setSeparator(event.target.value as CsvSeparator)} className={inputClass}><option value="comma">Coma (,)</option><option value="tab">Tabulación</option></select></label>}{tool.slug === "html-table-generator" && <Toggle label="Primera fila actúa como encabezado (<thead>)" checked={firstRowIsHeader} onChange={setFirstRowIsHeader} />}{tool.slug === "xml-escape" && <label className={labelClass}><span className="text-sm font-medium">Contexto de escape XML</span><select value={xmlContext} onChange={(event) => setXmlContext(event.target.value as XmlEscapeContext)} className={inputClass}><option value="content">Escapar como Contenido de Nodo XML</option><option value="attribute">Escapar como Atributo XML</option></select></label>}</div>}
    {tool.slug === "csv-to-json" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Nota: los encabezados se normalizan con trim() para crear claves consistentes; los espacios dentro de los valores de las celdas se conservan literalmente.</p>}
    {tool.slug === "csv-validator" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Las filas vacías se conservan durante la validación y se reportan como advertencias estructurales.</p>}
    {tool.slug === "url-parser" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Nota de privacidad: Las credenciales (username/password) detectadas en la URL se procesan exclusivamente de forma local en tu navegador y nunca son enviadas a ningún servidor externo.</p>}
    {tool.slug === "jwt-decoder" && <div role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm font-medium">Advertencia de Seguridad: Decodificar un token JWT localmente solo extrae su contenido legible, NO verifica la validez ni la integridad de la firma de seguridad</div>}
    <div className="flex flex-wrap gap-2"><button type="button" onClick={execute} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>{output && <button type="button" onClick={copy} className="rounded-xl border px-4 py-2">Copiar resultado</button>}</div>
    {error && <p role="alert" className="rounded-xl border p-4 text-sm">{error}</p>}
    {tool.slug === "jwt-header-inspector" && <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">Algoritmo de firma</div><div className="mt-1 font-mono font-bold">{jwtHeader.alg ?? "No indicado"}</div></div><div className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">Tipo de token</div><div className="mt-1 font-mono font-bold">{jwtHeader.typ ?? "No indicado"}</div></div></div>}
    {tool.slug === "jwt-decoder" && jwtTimes.length > 0 && <section className="space-y-2"><h3 className="font-semibold">Marcas de tiempo JWT</h3><div className="grid gap-3 sm:grid-cols-3">{jwtTimes.map((timestamp) => <div key={timestamp.key} className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">{timestamp.key}</div><div className="font-mono text-sm">{timestamp.iso}</div><div className="mt-1 text-xs text-muted-foreground">UNIX: {timestamp.unix}</div></div>)}</div></section>}
    {output && <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4 text-sm">{output}</pre>}
    <p className="text-xs text-muted-foreground">Procesamiento local: los datos introducidos no se envían a un servidor de UtiliHub.</p>
  </div>;
}
