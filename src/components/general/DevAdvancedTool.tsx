import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { base64Decode, csvToJson, diffJson, escapeXml, formatXml, jsonPathGet, parseHeaders, parseJson, pretty, queryBuild, queryParse, regexMatches, regexReplace, regexSplit, sortJsonKeys, unicodeInfo, validateCsv, urlInfo, jwtParts, jwtTimestamps, type CsvSeparator, type XmlEscapeContext } from "@/lib/general/dev-extra-engines";
import { generateHtmlTableWithOptions } from "@/lib/general/dev-extra-table-engine";

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
  const [jwtTimes, setJwtTimes] = useState<ReturnType<typeof jwtTimestamps>>([]);
  const [jwtHeader, setJwtHeader] = useState<{ alg?: string; typ?: string }>({});
  const slug = tool.slug;
  const isRegex = slug === "regex-replace" || slug === "regex-split" || slug === "regex-match-extractor";
  const isCsv = slug === "csv-to-json" || slug === "csv-validator" || slug === "html-table-generator";

  const execute = () => {
    try {
      setError(""); setJwtTimes([]); setJwtHeader({});
      let result = "";
      if (slug === "json-sort-keys") result = pretty(sortJsonKeys(parseJson(input)));
      else if (slug === "json-stringify") result = JSON.stringify(parseJson(input), null, jsonIndented ? 2 : 0);
      else if (slug === "json-unescape") { const decoded = JSON.parse(input) as unknown; result = typeof decoded === "string" ? decoded : pretty(decoded); }
      else if (slug === "json-path") result = pretty(jsonPathGet(parseJson(input), second));
      else if (slug === "json-diff") result = diffJson(parseJson(input), parseJson(second)).join("\n") || "Los documentos JSON son equivalentes.";
      else if (slug === "csv-to-json") result = csvToJson(input, separator);
      else if (slug === "csv-validator") result = validateCsv(input, separator);
      else if (slug === "xml-formatter") result = formatXml(input);
      else if (slug === "xml-escape") result = escapeXml(input, xmlContext);
      else if (slug === "url-parser") result = pretty(urlInfo(input));
      else if (slug === "query-string-parser") result = pretty(queryParse(input));
      else if (slug === "query-string-builder") result = queryBuild(input);
      else if (slug === "http-header-builder") result = parseHeaders(input);
      else if (slug === "jwt-decoder") { const parts = jwtParts(input); result = pretty(parts); setJwtTimes(jwtTimestamps(parts.payload)); }
      else if (slug === "jwt-header-inspector") { const header = jwtParts(input).header; if (header !== null && typeof header === "object") { const object = header as Record<string, unknown>; setJwtHeader({ alg: typeof object.alg === "string" ? object.alg : undefined, typ: typeof object.typ === "string" ? object.typ : undefined }); } result = pretty(header); }
      else if (slug === "regex-match-extractor") result = pretty(regexMatches(input, second, flags));
      else if (slug === "regex-replace") result = regexReplace(input, second, flags, replacement);
      else if (slug === "regex-split") result = pretty(regexSplit(input, second, flags));
      else if (slug === "unicode-inspector") result = unicodeInfo(input);
      else if (slug === "html-table-generator") result = generateHtmlTableWithOptions(input, separator, firstRowIsHeader);
      else if (slug === "base64-decoder") result = base64Decode(input);
      else throw new Error("Herramienta no implementada.");
      setOutput(result);
    } catch (errorValue) { setOutput(""); setJwtTimes([]); setJwtHeader({}); setError(errorValue instanceof Error ? errorValue.message : "Entrada inválida."); }
  };

  const copy = () => { if (output) void navigator.clipboard?.writeText(output); };

  return <div className="space-y-4">
    {slug === "json-stringify" && <div className="flex flex-wrap gap-3"><Toggle label="JSON Indentado (2 espacios)" checked={jsonIndented} onChange={setJsonIndented} /><span className="self-center text-xs text-muted-foreground">Desactivado = JSON compacto en una sola línea.</span></div>}
    {isRegex ? <div className="grid gap-4 md:grid-cols-2"><Field label="Expresión Regular (Patrón)" value={input} onChange={setInput} placeholder="\\b[A-Z][a-z]+\\b" /><Field label="Texto de Entrada" value={second} onChange={setSecond} placeholder="Texto sobre el que ejecutar la expresión…" textarea /><Field label="Banderas / Flags" value={flags} onChange={setFlags} placeholder="gim" />{slug === "regex-replace" && <Field label="Texto de Reemplazo" value={replacement} onChange={setReplacement} placeholder="$1 o texto de reemplazo" textarea />}</div> : <div className="grid gap-4 md:grid-cols-2"><Field label={slug === "json-path" ? "Documento JSON" : "Entrada principal"} value={input} onChange={setInput} placeholder={slug.startsWith("json") ? "Pega JSON válido…" : "Pega el contenido que quieras procesar…"} textarea />{slug === "json-path" && <Field label="Ruta JSON" value={second} onChange={setSecond} placeholder="$.usuarios[?(@.edad >= 18 && @.activo == true)].nombre" />}{slug === "json-diff" && <Field label="Segundo documento JSON" value={second} onChange={setSecond} placeholder="Pega el segundo JSON…" textarea />}{isCsv && <label className={labelClass}><span className="text-sm font-medium">Separador</span><select value={separator} onChange={(event) => setSeparator(event.target.value as CsvSeparator)} className={inputClass}><option value="comma">Coma (,)</option><option value="tab">Tabulación</option></select></label>}{slug === "html-table-generator" && <Toggle label="Primera fila actúa como encabezado (<thead>)" checked={firstRowIsHeader} onChange={setFirstRowIsHeader} />}{slug === "xml-escape" && <label className={labelClass}><span className="text-sm font-medium">Contexto de escape XML</span><select value={xmlContext} onChange={(event) => setXmlContext(event.target.value as XmlEscapeContext)} className={inputClass}><option value="content">Escapar como Contenido de Nodo XML</option><option value="attribute">Escapar como Atributo XML</option></select></label>}</div>}
    {slug === "csv-to-json" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Nota: los encabezados se normalizan con trim() para crear claves consistentes; los espacios dentro de los valores de las celdas se conservan literalmente.</p>}
    {slug === "csv-validator" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Las filas vacías se conservan durante la validación y se reportan como advertencias estructurales.</p>}
    {slug === "url-parser" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Nota de privacidad: Las credenciales (username/password) detectadas en la URL se procesan exclusivamente de forma local en tu navegador y nunca son enviadas a ningún servidor externo.</p>}
    {slug === "jwt-decoder" && <div role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm font-medium">Advertencia de Seguridad: Decodificar un token JWT localmente solo extrae su contenido legible, NO verifica la validez ni la integridad de la firma de seguridad</div>}
    <div className="flex flex-wrap gap-2"><button type="button" onClick={execute} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>{output && <button type="button" onClick={copy} className="rounded-xl border px-4 py-2">Copiar resultado</button>}</div>
    {error && <p role="alert" className="rounded-xl border p-4 text-sm">{error}</p>}
    {slug === "jwt-header-inspector" && (jwtHeader.alg || jwtHeader.typ) && <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">Algoritmo de firma</div><div className="mt-1 font-mono font-bold">{jwtHeader.alg ?? "No indicado"}</div></div><div className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">Tipo de token</div><div className="mt-1 font-mono font-bold">{jwtHeader.typ ?? "No indicado"}</div></div></div>}
    {slug === "jwt-decoder" && jwtTimes.length > 0 && <section className="space-y-2"><h3 className="font-semibold">Marcas de tiempo JWT</h3><div className="grid gap-3 sm:grid-cols-3">{jwtTimes.map((timestamp) => <div key={timestamp.key} className="rounded-xl border p-4"><div className="text-xs text-muted-foreground">{timestamp.key}</div><div className="font-mono text-sm">{timestamp.iso}</div><div className="mt-1 text-xs text-muted-foreground">UNIX: {timestamp.unix}</div></div>)}</div></section>}
    {output && <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4 text-sm">{output}</pre>}
    <p className="text-xs text-muted-foreground">Procesamiento local: los datos introducidos no se envían a un servidor de UtiliHub.</p>
  </div>;
}
