import { csvToJson, diffJson, escapeXml, formatXml, jsonPathGet, parseHeaders, parseJson, pretty, queryBuild, queryParse, regexMatches, regexReplace, regexSplit, sortJsonKeys, unicodeInfo, validateCsv, urlInfo, jwtParts, jwtTimestamps, type CsvSeparator, type XmlEscapeContext, type JwtTimestamp } from "./dev-extra-engines";
import { generateHtmlTableWithOptions } from "./dev-extra-table-engine";

export interface DevToolRunOptions {
  input: string;
  second: string;
  flags: string;
  replacement: string;
  separator: CsvSeparator;
  xmlContext: XmlEscapeContext;
  jsonIndented: boolean;
  firstRowIsHeader: boolean;
}

export interface DevToolRunResult {
  output: string;
  jwtTimes: JwtTimestamp[];
  jwtHeader: { alg?: string; typ?: string };
}

export function runDevTool(slug: string, options: DevToolRunOptions): DevToolRunResult {
  const { input, second, flags, replacement, separator, xmlContext, jsonIndented, firstRowIsHeader } = options;
  if (slug === "json-sort-keys") return { output: pretty(sortJsonKeys(parseJson(input))), jwtTimes: [], jwtHeader: {} };
  if (slug === "json-stringify") return { output: JSON.stringify(parseJson(input), null, jsonIndented ? 2 : 0), jwtTimes: [], jwtHeader: {} };
  if (slug === "json-unescape") { const decoded = JSON.parse(input) as unknown; return { output: typeof decoded === "string" ? decoded : pretty(decoded), jwtTimes: [], jwtHeader: {} }; }
  if (slug === "json-path") return { output: pretty(jsonPathGet(parseJson(input), second)), jwtTimes: [], jwtHeader: {} };
  if (slug === "json-diff") return { output: diffJson(parseJson(input), parseJson(second)).join("\n") || "Los documentos JSON son equivalentes.", jwtTimes: [], jwtHeader: {} };
  if (slug === "csv-to-json") return { output: csvToJson(input, separator), jwtTimes: [], jwtHeader: {} };
  if (slug === "csv-validator") return { output: validateCsv(input, separator), jwtTimes: [], jwtHeader: {} };
  if (slug === "xml-formatter") return { output: formatXml(input), jwtTimes: [], jwtHeader: {} };
  if (slug === "xml-escape") return { output: escapeXml(input, xmlContext), jwtTimes: [], jwtHeader: {} };
  if (slug === "url-parser") return { output: pretty(urlInfo(input)), jwtTimes: [], jwtHeader: {} };
  if (slug === "query-string-parser") return { output: pretty(queryParse(input)), jwtTimes: [], jwtHeader: {} };
  if (slug === "query-string-builder") return { output: queryBuild(input), jwtTimes: [], jwtHeader: {} };
  if (slug === "http-header-builder") return { output: parseHeaders(input), jwtTimes: [], jwtHeader: {} };
  if (slug === "jwt-decoder") { const parts = jwtParts(input); return { output: pretty(parts), jwtTimes: jwtTimestamps(parts.payload), jwtHeader: {} }; }
  if (slug === "jwt-header-inspector") { const header = jwtParts(input).header; const object = header !== null && typeof header === "object" ? header as Record<string, unknown> : {}; return { output: pretty(header), jwtTimes: [], jwtHeader: { alg: typeof object.alg === "string" ? object.alg : undefined, typ: typeof object.typ === "string" ? object.typ : undefined } }; }
  if (slug === "regex-match-extractor") return { output: pretty(regexMatches(input, second, flags)), jwtTimes: [], jwtHeader: {} };
  if (slug === "regex-replace") return { output: regexReplace(input, second, flags, replacement), jwtTimes: [], jwtHeader: {} };
  if (slug === "regex-split") return { output: pretty(regexSplit(input, second, flags)), jwtTimes: [], jwtHeader: {} };
  if (slug === "unicode-inspector") return { output: unicodeInfo(input), jwtTimes: [], jwtHeader: {} };
  if (slug === "html-table-generator") return { output: generateHtmlTableWithOptions(input, separator, firstRowIsHeader), jwtTimes: [], jwtHeader: {} };
  throw new Error("Herramienta no implementada.");
}
