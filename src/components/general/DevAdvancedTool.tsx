import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  csvToJson,
  escapeXml,
  generateHtmlTable,
  jsonPathGet,
  parseCsvRows,
  parseHeaders,
  regexFlags,
  regexReplace,
  regexSplit,
  unicodeInfo,
  validateCsv,
  type CsvSeparator,
} from "@/lib/general/dev-extra-engines";

const pretty = (value: unknown) => JSON.stringify(value, null, 2);
const parseJson = (value: string) => JSON.parse(value) as unknown;

function b64(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, child]) => [key, sortKeys(child)]),
    );
  }
  return value;
}

function diff(a: unknown, b: unknown, path = "$", output: string[] = []): string[] {
  if (Object.is(a, b)) return output;
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
    for (const key of [...keys].sort()) {
      const left = (a as Record<string, unknown>)[key];
      const right = (b as Record<string, unknown>)[key];
      if (!(key in (a as object))) output.push(`+ ${path}.${key}: ${pretty(right)}`);
      else if (!(key in (b as object))) output.push(`- ${path}.${key}: ${pretty(left)}`);
      else diff(left, right, `${path}.${key}`, output);
    }
    return output;
  }
  output.push(`~ ${path}: ${pretty(a)} → ${pretty(b)}`);
  return output;
}

function xmlPretty(input: string) {
  const doc = new DOMParser().parseFromString(input, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("XML inválido.");
  const walk = (node: Node, depth = 0): string => {
    const pad = "  ".repeat(depth);
    if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() ? pad + node.textContent.trim() : "";
    if (node.nodeType === Node.COMMENT_NODE) return `${pad}<!--${node.textContent ?? ""}-->`;
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const element = node as Element;
    const attrs = [...element.attributes]
      .map((attribute) => ` ${attribute.name}="${escapeXml(attribute.value, "attribute")}"`)
      .join("");
    const children = [...element.childNodes].filter((child) => child.nodeType !== Node.TEXT_NODE || child.textContent?.trim());
    if (!children.length) return `${pad}<${element.tagName}${attrs}/>`;
    const onlyText = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
    if (onlyText) return `${pad}<${element.tagName}${attrs}>${escapeXml(children[0].textContent ?? "", "content")}</${element.tagName}>`;
    return `${pad}<${element.tagName}${attrs}>\n${children.map((child) => walk(child, depth + 1)).filter(Boolean).join("\n")}\n${pad}</${element.tagName}>`;
  };
  return walk(doc.documentElement);
}

function urlInfo(input: string) {
  const url = new URL(input);
  return pretty({
    href: url.href,
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
  });
}

function queryParse(input: string) {
  const params = new URLSearchParams(input.replace(/^\?/, ""));
  const output: Array<{ key: string; value: string }> = [];
  params.forEach((value, key) => output.push({ key, value }));
  return pretty(output);
}

function queryBuild(input: string) {
  const lines = input.split(/\r?\n/).filter(Boolean);
  const params = new URLSearchParams();
  for (const line of lines) {
    const index = line.indexOf("=");
    if (index < 1) throw new Error(`Línea inválida: ${line}`);
    params.append(line.slice(0, index).trim(), line.slice(index + 1));
  }
  return params.toString();
}

function jwtParts(input: string) {
  const parts = input.trim().split(".");
  if (parts.length !== 3) throw new Error("Un JWT debe tener tres segmentos separados por puntos.");
  return { header: parseJson(b64(parts[0])), payload: parseJson(b64(parts[1])), signature: parts[2] };
}

function regexMatches(pattern: string, text: string, flags: string) {
  const validFlags = regexFlags(flags);
  const effectiveFlags = validFlags.includes("g") ? validFlags : `${validFlags}g`;
  return [...text.matchAll(new RegExp(pattern, effectiveFlags))].map((match) => ({
    match: match[0],
    index: match.index ?? -1,
    groups: match.slice(1),
  }));
}

function run(
  slug: string,
  input: string,
  second: string,
  flags: string,
  replacement: string,
  separator: CsvSeparator,
  xmlContext: "content" | "attribute",
) {
  switch (slug) {
    case "json-sort-keys": return pretty(sortKeys(parseJson(input)));
    case "json-stringify": return JSON.stringify(parseJson(input));
    case "json-unescape": return JSON.stringify(JSON.parse(input));
    case "json-path": return pretty(jsonPathGet(parseJson(input), second));
    case "json-diff": return diff(parseJson(input), parseJson(second)).join("\n") || "Los documentos JSON son equivalentes.";
    case "csv-to-json": return csvToJson(input, separator);
    case "csv-validator": return validateCsv(input, separator);
    case "xml-formatter": return xmlPretty(input);
    case "xml-escape": return escapeXml(input, xmlContext);
    case "url-parser": return urlInfo(input);
    case "query-string-parser": return queryParse(input);
    case "query-string-builder": return queryBuild(input);
    case "http-header-builder": return parseHeaders(input);
    case "jwt-decoder": return pretty(jwtParts(input));
    case "jwt-header-inspector": return pretty(jwtParts(input).header);
    case "regex-match-extractor": return pretty(regexMatches(input, second, flags));
    case "regex-replace": return regexReplace(input, second, flags, replacement);
    case "regex-split": return pretty(regexSplit(input, second, flags));
    case "unicode-inspector": return unicodeInfo(input);
    case "html-table-generator": return generateHtmlTable(input, separator);
    default: return "Herramienta no implementada.";
  }
}

const labelClass = "space-y-1";
const inputClass = "h-11 w-full rounded-xl border bg-background px-3 font-mono text-sm";
const textareaClass = "min-h-48 w-full rounded-xl border bg-background p-4 font-mono text-sm";

function Field({ label, value, onChange, placeholder, textarea = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; textarea?: boolean }) {
  return <label className={labelClass}>
    <span className="text-sm font-medium">{label}</span>
    {textarea ? <textarea value={value} onChange={(event) => onChange(event.target.value)} className={textareaClass} placeholder={placeholder} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} placeholder={placeholder} />}
  </label>;
}

export function DevAdvancedTool({ tool }: { tool: GeneralTool }) {
  const [input, setInput] = useState("");
  const [second, setSecond] = useState("");
  const [flags, setFlags] = useState("g");
  const [replacement, setReplacement] = useState("");
  const [separator, setSeparator] = useState<CsvSeparator>("comma");
  const [xmlContext, setXmlContext] = useState<"content" | "attribute">("content");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const isRegexReplace = tool.slug === "regex-replace";
  const isRegexSplit = tool.slug === "regex-split";
  const isRegexMatch = tool.slug === "regex-match-extractor";
  const isRegex = isRegexReplace || isRegexSplit || isRegexMatch;
  const isCsv = ["csv-to-json", "csv-validator", "html-table-generator"].includes(tool.slug);

  const execute = () => {
    try {
      setError("");
      setOutput(String(run(tool.slug, input, second, flags, replacement, separator, xmlContext)));
    } catch (errorValue) {
      setOutput("");
      setError(errorValue instanceof Error ? errorValue.message : "Entrada inválida.");
    }
  };

  const copy = () => {
    if (output) void navigator.clipboard?.writeText(output);
  };

  return <div className="space-y-4">
    {isRegex ? <div className="grid gap-4 md:grid-cols-2">
      <Field label="Expresión Regular (Patrón)" value={input} onChange={setInput} placeholder="\\b[A-Z][a-z]+\\b" />
      <Field label="Banderas / Flags" value={flags} onChange={setFlags} placeholder="gim" />
      <Field label="Texto de Entrada" value={second} onChange={setSecond} placeholder="Texto sobre el que ejecutar la expresión…" textarea />
      {isRegexReplace && <Field label="Texto de Reemplazo" value={replacement} onChange={setReplacement} placeholder="$1 o texto de reemplazo" textarea />}
    </div> : <div className="grid gap-4 md:grid-cols-2">
      <Field
        label={tool.slug === "json-path" ? "Documento JSON" : "Entrada principal"}
        value={input}
        onChange={setInput}
        placeholder={tool.slug.startsWith("json") ? "Pega JSON válido…" : "Pega el contenido que quieras procesar…"}
        textarea
      />
      {tool.slug === "json-path" && <Field label="Ruta JSON" value={second} onChange={setSecond} placeholder="$.usuarios[?(@.edad >= 18)].nombre" />}
      {tool.slug === "json-diff" && <Field label="Segundo documento JSON" value={second} onChange={setSecond} placeholder="Pega el segundo JSON…" textarea />}
      {isCsv && <label className={labelClass}>
        <span className="text-sm font-medium">Separador</span>
        <select value={separator} onChange={(event) => setSeparator(event.target.value as CsvSeparator)} className={inputClass}>
          <option value="comma">Coma (,)</option>
          <option value="tab">Tabulación</option>
        </select>
      </label>}
      {tool.slug === "xml-escape" && <label className={labelClass}>
        <span className="text-sm font-medium">Contexto de escape XML</span>
        <select value={xmlContext} onChange={(event) => setXmlContext(event.target.value as "content" | "attribute")} className={inputClass}>
          <option value="content">Escapar como Contenido de Nodo XML</option>
          <option value="attribute">Escapar como Atributo XML</option>
        </select>
      </label>}
    </div>}

    {tool.slug === "url-parser" && <p className="rounded-xl border p-3 text-xs text-muted-foreground">Nota de privacidad: Las credenciales (username/password) detectadas en la URL se procesan exclusivamente de forma local en tu navegador y nunca son enviadas a ningún servidor externo.</p>}
    {tool.slug === "jwt-decoder" && <div role="alert" className="rounded-xl border border-amber-500/50 bg-amber-500/10 p-4 text-sm font-medium">Advertencia de Seguridad: Decodificar un token JWT localmente solo extrae su contenido legible, NO verifica la validez ni la integridad de la firma de seguridad</div>}

    <div className="flex flex-wrap gap-2">
      <button onClick={execute} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>
      {output && <button onClick={copy} className="rounded-xl border px-4 py-2">Copiar resultado</button>}
    </div>
    {error && <p role="alert" className="rounded-xl border p-4 text-sm">{error}</p>}
    {output && <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4 text-sm">{output}</pre>}
    <p className="text-xs text-muted-foreground">Procesamiento local: los datos introducidos no se envían a un servidor de UtiliHub.</p>
  </div>;
}
