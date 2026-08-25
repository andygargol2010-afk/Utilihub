export type CsvSeparator = "comma" | "tab";
export type XmlEscapeContext = "content" | "attribute";

export function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function parseJson(value: string): unknown {
  return JSON.parse(value) as unknown;
}

export function base64Decode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, sortJsonKeys(child)]),
    );
  }
  return value;
}

export function diffJson(left: unknown, right: unknown, path = "$", output: string[] = []): string[] {
  if (Object.is(left, right)) return output;
  if (left !== null && right !== null && typeof left === "object" && typeof right === "object" && !Array.isArray(left) && !Array.isArray(right)) {
    const leftObject = left as Record<string, unknown>;
    const rightObject = right as Record<string, unknown>;
    const keys = [...new Set([...Object.keys(leftObject), ...Object.keys(rightObject)])].sort();
    for (const key of keys) {
      const childPath = `${path}.${key}`;
      if (!(key in leftObject)) output.push(`+ ${childPath}: ${pretty(rightObject[key])}`);
      else if (!(key in rightObject)) output.push(`- ${childPath}: ${pretty(leftObject[key])}`);
      else diffJson(leftObject[key], rightObject[key], childPath, output);
    }
    return output;
  }
  output.push(`~ ${path}: ${pretty(left)} → ${pretty(right)}`);
  return output;
}

function findClosingBracket(source: string, start: number): number {
  let quote: "'" | '"' | "" = "";
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote && source[index - 1] !== "\\") quote = "";
      continue;
    }
    if (character === "'" || character === '"') quote = character;
    else if (character === "[") depth += 1;
    else if (character === "]") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error("Ruta JSON inválida: falta ] de cierre.");
}

function tokenizeJsonPath(path: string): string[] {
  const source = path.trim();
  if (!source.startsWith("$")) throw new Error("La ruta JSON debe comenzar con $.");
  const tokens: string[] = [];
  let index = 1;
  while (index < source.length) {
    if (source[index] === ".") {
      index += 1;
      if (source[index] === "*") { tokens.push("*"); index += 1; continue; }
      const match = source.slice(index).match(/^[A-Za-z_$][\w$-]*/);
      if (!match) throw new Error(`Ruta JSON inválida cerca de: ${source.slice(index)}`);
      tokens.push(match[0]);
      index += match[0].length;
      continue;
    }
    if (source[index] !== "[") throw new Error(`Ruta JSON inválida cerca de: ${source.slice(index)}`);
    const end = findClosingBracket(source, index);
    const content = source.slice(index + 1, end).trim();
    if (content === "*") tokens.push("*");
    else if (/^\d+$/.test(content)) tokens.push(content);
    else if ((content.startsWith("'") && content.endsWith("'")) || (content.startsWith('"') && content.endsWith('"'))) {
      tokens.push(content.slice(1, -1).replace(/\\([\\'\"])/g, "$1"));
    } else if (content.startsWith("?(") && content.endsWith(")")) {
      tokens.push(`?${content.slice(2, -1).trim()}`);
    } else throw new Error(`Selector JSON no compatible: [${content}]`);
    index = end + 1;
  }
  return tokens;
}

function getProperty(value: unknown, key: string): unknown {
  if (value === null || typeof value !== "object") return undefined;
  return (value as Record<string, unknown>)[key];
}

function splitLogical(expression: string, operator: "&&" | "||"): string[] {
  const parts: string[] = [];
  let start = 0;
  let quote: "'" | '"' | "" = "";
  let depth = 0;
  for (let index = 0; index < expression.length; index += 1) {
    const character = expression[index];
    if (quote) {
      if (character === quote && expression[index - 1] !== "\\") quote = "";
      continue;
    }
    if (character === "'" || character === '"') quote = character;
    else if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;
    else if (depth === 0 && expression.slice(index, index + operator.length) === operator) {
      parts.push(expression.slice(start, index).trim());
      start = index + operator.length;
      index += operator.length - 1;
    }
  }
  parts.push(expression.slice(start).trim());
  return parts;
}

function parseFilterLiteral(raw: string): unknown {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).replace(/\\([\\'\"])/g, "$1");
  }
  const numeric = Number(value);
  if (value !== "" && Number.isFinite(numeric)) return numeric;
  throw new Error(`Valor de filtro no compatible: ${value}`);
}

function compareFilterExpression(item: unknown, expression: string): boolean {
  const match = expression.trim().match(/^@(?:\.([A-Za-z_$][\w$-]*))?\s*(===|!==|==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!match) throw new Error(`Filtro JSON básico no compatible: ${expression}`);
  const actual = match[1] ? getProperty(item, match[1]) : item;
  const expected = parseFilterLiteral(match[3]);
  switch (match[2]) {
    case "===": case "==": return actual === expected;
    case "!==": case "!=": return actual !== expected;
    case ">": return typeof actual === "number" && typeof expected === "number" && actual > expected;
    case ">=": return typeof actual === "number" && typeof expected === "number" && actual >= expected;
    case "<": return typeof actual === "number" && typeof expected === "number" && actual < expected;
    case "<=": return typeof actual === "number" && typeof expected === "number" && actual <= expected;
    default: return false;
  }
}

function compareFilter(item: unknown, expression: string): boolean {
  const orParts = splitLogical(expression, "||");
  return orParts.some((orPart) => splitLogical(orPart, "&&").every((andPart) => compareFilterExpression(item, andPart)));
}

export function jsonPathGet(root: unknown, path: string): unknown {
  const tokens = tokenizeJsonPath(path);
  let values: unknown[] = [root];
  for (const token of tokens) {
    const next: unknown[] = [];
    if (token === "*") {
      for (const value of values) {
        if (Array.isArray(value)) next.push(...value);
        else if (value !== null && typeof value === "object") next.push(...Object.values(value as Record<string, unknown>));
      }
    } else if (token.startsWith("?")) {
      const expression = token.slice(1);
      for (const value of values) {
        const candidates = Array.isArray(value) ? value : value !== null && typeof value === "object" ? Object.values(value as Record<string, unknown>) : [];
        next.push(...candidates.filter((item) => compareFilter(item, expression)));
      }
    } else {
      for (const value of values) {
        if (value !== null && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, token)) {
          next.push((value as Record<string, unknown>)[token]);
        }
      }
    }
    values = next;
    if (!values.length) return undefined;
  }
  return values.length === 1 ? values[0] : values;
}

export function utf16Units(character: string): string {
  const codePoint = character.codePointAt(0);
  if (codePoint === undefined) return "";
  if (codePoint <= 0xffff) return codePoint.toString(16).toUpperCase().padStart(4, "0");
  const adjusted = codePoint - 0x10000;
  const high = 0xd800 + (adjusted >> 10);
  const low = 0xdc00 + (adjusted & 0x3ff);
  return [high, low].map((unit) => unit.toString(16).toUpperCase().padStart(4, "0")).join(" ");
}

export function unicodeInfo(input: string): string {
  return [...input].map((character, index) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return `${index + 1}. ${character} · U+${codePoint.toString(16).toUpperCase().padStart(4, "0")} · UTF-16 ${utf16Units(character)}`;
  }).join("\n");
}

export function regexFlags(flags: string): string {
  const valid = new Set(["d", "g", "i", "m", "s", "u", "v", "y"]);
  const seen = new Set<string>();
  for (const flag of flags) {
    if (!valid.has(flag) || seen.has(flag)) throw new Error(`Flags inválidas: ${flag}`);
    seen.add(flag);
  }
  if (seen.has("u") && seen.has("v")) throw new Error("Flags inválidas: u y v no pueden utilizarse juntas.");
  return flags;
}

export function regexMatches(pattern: string, text: string, flags: string): Array<{ match: string; index: number; groups: Array<string | undefined> }> {
  const validFlags = regexFlags(flags);
  const expression = new RegExp(pattern, validFlags);
  const matches: Array<{ match: string; index: number; groups: Array<string | undefined> }> = [];
  if (expression.global || expression.sticky) {
    let result: RegExpExecArray | null;
    while ((result = expression.exec(text)) !== null) {
      matches.push({ match: result[0], index: result.index, groups: result.slice(1) });
      if (result[0] === "") expression.lastIndex += 1;
    }
  } else {
    const result = expression.exec(text);
    if (result) matches.push({ match: result[0], index: result.index, groups: result.slice(1) });
  }
  return matches;
}

export function regexReplace(pattern: string, text: string, flags: string, replacement: string): string {
  return text.replace(new RegExp(pattern, regexFlags(flags)), replacement);
}

export function regexSplit(pattern: string, text: string, flags: string): string[] {
  return text.split(new RegExp(pattern, regexFlags(flags)));
}

export function parseHeaders(input: string): string {
  const output: Record<string, string | string[]> = {};
  const keyByLowerCase = new Map<string, string>();
  for (const line of input.split(/\r?\n/).filter((value) => value.length > 0)) {
    const index = line.indexOf(":");
    if (index < 1) throw new Error(`Cabecera inválida: ${line}`);
    const name = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    const lookup = name.toLowerCase();
    const key = keyByLowerCase.get(lookup) ?? name;
    keyByLowerCase.set(lookup, key);
    const existing = output[key];
    if (existing === undefined) output[key] = value;
    else output[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  }
  return pretty(output);
}

export function escapeXml(input: string, context: XmlEscapeContext): string {
  let output = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (context === "attribute") output = output.replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  return output;
}

export function formatXml(input: string): string {
  const document = new DOMParser().parseFromString(input, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("XML inválido.");

  const render = (node: Node, depth: number): string => {
    const pad = "  ".repeat(depth);
    if (node.nodeType === Node.COMMENT_NODE) return `${pad}<!--${node.nodeValue ?? ""}-->`;
    if (node.nodeType === Node.CDATA_SECTION_NODE) return `${pad}<![CDATA[${node.nodeValue ?? ""}]]>`;
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const element = node as Element;
    const attributes = [...element.attributes].map((attribute) => ` ${attribute.name}="${escapeXml(attribute.value, "attribute")}"`).join("");
    const childNodes = [...element.childNodes];
    const meaningfulChildren = childNodes.filter((child) => child.nodeType !== Node.TEXT_NODE || (child.nodeValue ?? "").trim() !== "");
    if (meaningfulChildren.length === 0) return `${pad}<${element.tagName}${attributes}/>`;

    const hasMixedContent = meaningfulChildren.some((child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) && meaningfulChildren.some((child) => child.nodeType === Node.ELEMENT_NODE || child.nodeType === Node.COMMENT_NODE);
    if (hasMixedContent) {
      const content = childNodes.map((child) => {
        if (child.nodeType === Node.TEXT_NODE) return child.nodeValue ?? "";
        if (child.nodeType === Node.CDATA_SECTION_NODE) return `<![CDATA[${child.nodeValue ?? ""}]]>`;
        return render(child, 0).trim();
      }).join("");
      return `${pad}<${element.tagName}${attributes}>${content}</${element.tagName}>`;
    }

    const onlyInlineContent = meaningfulChildren.every((child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE);
    if (onlyInlineContent) {
      const content = childNodes.map((child) => child.nodeType === Node.TEXT_NODE ? child.nodeValue ?? "" : child.nodeType === Node.CDATA_SECTION_NODE ? `<![CDATA[${child.nodeValue ?? ""}]]>` : "").join("");
      return `${pad}<${element.tagName}${attributes}>${content}</${element.tagName}>`;
    }

    const children = meaningfulChildren.map((child) => render(child, depth + 1)).filter(Boolean).join("\n");
    return `${pad}<${element.tagName}${attributes}>\n${children}\n${pad}</${element.tagName}>`;
  };

  return render(document.documentElement, 0);
}

export function parseCsvRows(input: string, separator: CsvSeparator = "comma"): string[][] {
  const delimiter = separator === "tab" ? "\t" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"') {
      if (quoted && input[index + 1] === '"') { cell += '"'; index += 1; }
      else quoted = !quoted;
      continue;
    }
    if (character === delimiter && !quoted) { row.push(cell); cell = ""; continue; }
    if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += character;
  }
  if (quoted) throw new Error("CSV inválido: hay comillas sin cerrar.");
  if (cell.length > 0 || row.length > 0 || input.endsWith(delimiter)) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function validateCsvShape(rows: string[][]): string[] {
  if (!rows.length) return ["No hay filas CSV."];
  const expected = rows[0].length;
  return rows.map((row, index) => row.length === expected ? "" : `Fila ${index + 1}: ${row.length} columnas (esperadas ${expected}).`).filter(Boolean);
}

export function csvToJson(input: string, separator: CsvSeparator = "comma"): string {
  const rows = parseCsvRows(input, separator).filter((row) => row.some((cell) => cell.length > 0));
  if (!rows.length) throw new Error("No hay datos CSV.");
  const headers = rows[0].map((header) => header.trim());
  if (headers.some((header) => !header)) throw new Error("El CSV contiene un encabezado vacío.");
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const header of headers) {
    if (seen.has(header)) duplicates.add(header);
    seen.add(header);
  }
  if (duplicates.size) throw new Error(`Encabezados duplicados: ${[...duplicates].join(", ")}. Corrige las columnas antes de convertir el CSV.`);
  const shapeErrors = validateCsvShape(rows);
  if (shapeErrors.length) throw new Error(shapeErrors.join("\n"));
  return pretty(rows.slice(1).map((row) => Object.fromEntries(headers.map((header, column) => [header, row[column]]))));
}

export function validateCsv(input: string, separator: CsvSeparator = "comma"): string {
  const rows = parseCsvRows(input, separator);
  if (!rows.length) return "No hay filas.";
  const errors = validateCsvShape(rows);
  const emptyRows = rows.map((row, index) => row.every((cell) => cell === "") ? index + 1 : 0).filter((index) => index > 0);
  const messages = [...errors];
  if (emptyRows.length) messages.push(`Advertencia: filas vacías preservadas en las posiciones ${emptyRows.join(", ")}.`);
  return messages.length ? messages.join("\n") : `CSV válido: ${Math.max(rows.length - 1, 0)} filas de datos y ${rows[0].length} columnas.`;
}

export function generateHtmlTable(input: string, separator: CsvSeparator, firstRowIsHeader: boolean): string {
  const rows = parseCsvRows(input).filter((row) => row.some((cell) => cell.length > 0));
  if (!rows.length) throw new Error("Introduce datos tabulares.");
  const expected = rows[0].length;
  const inconsistent = rows.findIndex((row) => row.length !== expected);
  if (inconsistent !== -1) throw new Error(`Fila ${inconsistent + 1} inconsistente: tiene ${rows[inconsistent].length} columnas y se esperaban ${expected}. Corrige los datos antes de generar la tabla.`);
  const cell = (value: string, tag: "td" | "th") => `<${tag}>${escapeXml(value, "content")}</${tag}>`;
  const header = firstRowIsHeader ? `  <thead><tr>${rows[0].map((value) => cell(value, "th")).join("")}</tr></thead>\n` : "";
  const bodyRows = (firstRowIsHeader ? rows.slice(1) : rows).map((row) => `    <tr>${row.map((value) => cell(value, "td")).join("")}</tr>`).join("\n");
  return `<table>\n${header}  <tbody>\n${bodyRows}\n  </tbody>\n</table>`;
}

export function urlInfo(input: string): Record<string, string> {
  const url = new URL(input);
  return { href: url.href, protocol: url.protocol, username: url.username, password: url.password, host: url.host, hostname: url.hostname, port: url.port, pathname: url.pathname, search: url.search, hash: url.hash, origin: url.origin };
}

export function queryParse(input: string): Array<{ key: string; value: string }> {
  const params = new URLSearchParams(input.replace(/^\?/, ""));
  const output: Array<{ key: string; value: string }> = [];
  params.forEach((value, key) => output.push({ key, value }));
  return output;
}

export function queryBuild(input: string): string {
  const lines = input.split(/\r?\n/).map((line) => line.trimEnd()).filter((line) => line.trim().length > 0);
  const params = new URLSearchParams();
  for (const line of lines) {
    const index = line.indexOf("=");
    const key = (index === -1 ? line : line.slice(0, index)).trim();
    if (!key) throw new Error(`Línea inválida: ${line}`);
    const value = index === -1 ? "" : line.slice(index + 1);
    params.append(key, value);
  }
  return params.toString();
}

export interface JwtParts {
  header: unknown;
  payload: unknown;
  signature: string;
}

export function jwtParts(input: string): JwtParts {
  const parts = input.trim().split(".");
  if (parts.length !== 3) throw new Error("Un JWT debe tener tres segmentos separados por puntos.");
  return { header: parseJson(base64Decode(parts[0])), payload: parseJson(base64Decode(parts[1])), signature: parts[2] };
}

export interface JwtTimestamp {
  key: "iat" | "exp" | "nbf";
  unix: number;
  iso: string;
}

export function jwtTimestamps(payload: unknown): JwtTimestamp[] {
  if (payload === null || typeof payload !== "object") return [];
  const object = payload as Record<string, unknown>;
  return (["iat", "exp", "nbf"] as const).flatMap((key) => {
    const value = object[key];
    if (typeof value !== "number" || !Number.isFinite(value)) return [];
    const date = new Date(value * 1000);
    return Number.isNaN(date.getTime()) ? [] : [{ key, unix: value, iso: date.toISOString() }];
  });
}
