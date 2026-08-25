export type CsvSeparator = "comma" | "tab";

export function parseCsvRows(input: string, separator: CsvSeparator = "comma"): string[][] {
  const delimiter = separator === "tab" ? "\t" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i += 1; }
      else quoted = !quoted;
      continue;
    }
    if (char === delimiter && !quoted) { row.push(cell); cell = ""; continue; }
    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = []; cell = ""; continue;
    }
    cell += char;
  }
  if (quoted) throw new Error("CSV inválido: hay comillas sin cerrar.");
  row.push(cell);
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

export function csvToJson(input: string, separator: CsvSeparator = "comma"): string {
  const rows = parseCsvRows(input, separator);
  if (!rows.length) throw new Error("No hay datos CSV.");
  const headers = rows[0];
  if (headers.some((header) => !header.trim())) throw new Error("El CSV contiene un encabezado vacío.");
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const header of headers) {
    const normalized = header.trim();
    if (seen.has(normalized)) duplicates.add(normalized);
    seen.add(normalized);
  }
  if (duplicates.size) throw new Error(`Encabezados duplicados: ${[...duplicates].join(", ")}. Corrige las columnas antes de convertir el CSV.`);
  return JSON.stringify(rows.slice(1).map((row, index) => {
    if (row.length !== headers.length) throw new Error(`Fila ${index + 2}: tiene ${row.length} columnas; se esperaban ${headers.length}.`);
    return Object.fromEntries(headers.map((header, column) => [header.trim(), row[column]]));
  }), null, 2);
}

export function validateCsv(input: string, separator: CsvSeparator = "comma"): string {
  const rows = parseCsvRows(input, separator);
  if (!rows.length) return "No hay filas.";
  const expected = rows[0].length;
  const errors = rows.map((row, index) => row.length !== expected ? `Fila ${index + 1}: ${row.length} columnas (esperadas ${expected}).` : "").filter(Boolean);
  return errors.length ? errors.join("\n") : `CSV válido: ${Math.max(rows.length - 1, 0)} filas de datos y ${expected} columnas.`;
}

function tokenizeJsonPath(path: string): string[] {
  const source = path.trim();
  if (!source.startsWith("$")) throw new Error("La ruta JSON debe comenzar con $.");
  const tokens: string[] = [];
  let i = 1;
  while (i < source.length) {
    if (source[i] === ".") {
      i += 1;
      if (source[i] === "*") { tokens.push("*"); i += 1; continue; }
      const match = source.slice(i).match(/^[A-Za-z_$][\w$-]*/);
      if (!match) throw new Error(`Ruta JSON inválida cerca de: ${source.slice(i)}`);
      tokens.push(match[0]); i += match[0].length; continue;
    }
    if (source[i] !== "[") throw new Error(`Ruta JSON inválida cerca de: ${source.slice(i)}`);
    const end = findClosingBracket(source, i);
    const content = source.slice(i + 1, end).trim();
    if (content === "*") tokens.push("*");
    else if (/^\d+$/.test(content)) tokens.push(content);
    else if ((content.startsWith("'") && content.endsWith("'")) || (content.startsWith('"') && content.endsWith('"'))) tokens.push(content.slice(1, -1).replace(/\\([\\'\"])/g, "$1"));
    else if (content.startsWith("?(") && content.endsWith(")")) tokens.push(`?${content.slice(2, -1).trim()}`);
    else throw new Error(`Selector JSON no compatible: [${content}]`);
    i = end + 1;
  }
  return tokens;
}

function findClosingBracket(source: string, start: number): number {
  let quote = ""; let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (quote) { if (char === quote && source[i - 1] !== "\\") quote = ""; continue; }
    if (char === "'" || char === '"') quote = char;
    else if (char === "[") depth += 1;
    else if (char === "]") { depth -= 1; if (depth === 0) return i; }
  }
  throw new Error("Ruta JSON inválida: falta ] de cierre.");
}

function getProperty(value: unknown, key: string): unknown {
  if (value === null || typeof value !== "object") return undefined;
  return (value as Record<string, unknown>)[key];
}

function compareFilter(item: unknown, expression: string): boolean {
  const match = expression.match(/^@(?:\.([A-Za-z_$][\w$-]*))?\s*(===|==|!==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!match) throw new Error(`Filtro JSON básico no compatible: ${expression}`);
  const actual = match[1] ? getProperty(item, match[1]) : item;
  const rawExpected = match[3].trim();
  let expected: unknown;
  try { expected = JSON.parse(rawExpected.replace(/^'/, '"').replace(/'$/, '"')); }
  catch { expected = rawExpected.replace(/^['"]|['"]$/g, ""); }
  switch (match[2]) {
    case "==": case "===": return actual === expected || String(actual) === String(expected);
    case "!=": case "!==": return !(actual === expected || String(actual) === String(expected));
    case ">": return Number(actual) > Number(expected);
    case ">=": return Number(actual) >= Number(expected);
    case "<": return Number(actual) < Number(expected);
    case "<=": return Number(actual) <= Number(expected);
    default: return false;
  }
}

export function jsonPathGet(root: unknown, path: string): unknown {
  const tokens = tokenizeJsonPath(path);
  let values: unknown[] = [root];
  for (const token of tokens) {
    const next: unknown[] = [];
    if (token === "*") {
      for (const value of values) {
        if (Array.isArray(value)) next.push(...value);
        else if (value && typeof value === "object") next.push(...Object.values(value));
      }
    } else if (token.startsWith("?")) {
      const expression = token.slice(1);
      for (const value of values) {
        if (Array.isArray(value)) next.push(...value.filter((item) => compareFilter(item, expression)));
        else if (value && typeof value === "object") next.push(...Object.values(value).filter((item) => compareFilter(item, expression)));
      }
    } else {
      for (const value of values) {
        const property = getProperty(value, token);
        if (property !== undefined) next.push(property);
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
    const codePoint = character.codePointAt(0)!;
    return `${index + 1}. ${character} · U+${codePoint.toString(16).toUpperCase().padStart(4, "0")} · UTF-16 ${utf16Units(character)}`;
  }).join("\n");
}

export function regexFlags(flags: string): string {
  const valid = new Set(["d", "g", "i", "m", "s", "u", "v", "y"]);
  const seen = new Set<string>();
  for (const flag of flags) {
    if (!valid.has(flag)) throw new Error(`Flags inválidas: ${flag}`);
    if (seen.has(flag)) throw new Error(`Flags inválidas: ${flag}`);
    seen.add(flag);
  }
  return flags;
}

export function regexReplace(pattern: string, text: string, flags: string, replacement: string): string {
  return text.replace(new RegExp(pattern, regexFlags(flags)), replacement);
}

export function regexSplit(pattern: string, text: string, flags: string): string[] {
  return text.split(new RegExp(pattern, regexFlags(flags)));
}

export function parseHeaders(input: string): string {
  const out: Record<string, string | string[]> = {};
  const keyByLowerCase = new Map<string, string>();
  for (const line of input.split(/\r?\n/).filter(Boolean)) {
    const index = line.indexOf(":");
    if (index < 1) throw new Error(`Cabecera inválida: ${line}`);
    const name = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    const lookup = name.toLowerCase();
    const key = keyByLowerCase.get(lookup) ?? name;
    keyByLowerCase.set(lookup, key);
    const existing = out[key];
    if (existing === undefined) out[key] = value;
    else out[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
  }
  return JSON.stringify(out, null, 2);
}

export function escapeXml(input: string, context: "content" | "attribute"): string {
  let output = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (context === "attribute") output = output.replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  return output;
}

export function generateHtmlTable(input: string, separator: CsvSeparator): string {
  const rows = parseCsvRows(input, separator);
  if (!rows.length) throw new Error("Introduce datos tabulares.");
  const expected = rows[0].length;
  const inconsistent = rows.findIndex((row) => row.length !== expected);
  if (inconsistent !== -1) throw new Error(`Fila ${inconsistent + 1} inconsistente: tiene ${rows[inconsistent].length} columnas y se esperaban ${expected}. Corrige los datos antes de generar la tabla.`);
  const head = rows[0].map((cell) => `<th>${escapeXml(cell.trim(), "content")}</th>`).join("");
  const body = rows.slice(1).map((row) => `    <tr>${row.map((cell) => `<td>${escapeXml(cell.trim(), "content")}</td>`).join("")}</tr>`).join("\n");
  return `<table>\n  <thead><tr>${head}</tr></thead>\n  <tbody>\n${body}\n  </tbody>\n</table>`;
}
