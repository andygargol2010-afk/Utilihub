/** Infer a TypeScript interface from a JSON sample. Nothing is uploaded. */

export type JsonTsIssue = { level: "error" | "warn"; code: string };

export type JsonTsResult = {
  code: string;
  issues: JsonTsIssue[];
  interfaces: number;
};

export type JsonTsOptions = {
  rootName: string;
  exportTypes: boolean;
  nullAsOptional: boolean;
};

const EXAMPLE = `{
  "id": 1,
  "name": "Ada",
  "tags": ["math", null],
  "meta": { "ok": true }
}`;

export const JSON_TS_EXAMPLE = EXAMPLE;

function isIdentifier(key: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

function quoteKey(key: string): string {
  return isIdentifier(key) ? key : JSON.stringify(key);
}

function pascal(raw: string): string {
  const parts = raw
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const name = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
  if (!name) return "Item";
  return /^[0-9]/.test(name) ? `Item${name}` : name;
}

function uniqueName(base: string, used: Set<string>): string {
  let name = pascal(base);
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  let i = 2;
  while (used.has(`${name}${i}`)) i += 1;
  const next = `${name}${i}`;
  used.add(next);
  return next;
}

type InferCtx = {
  used: Set<string>;
  blocks: string[];
  exportTypes: boolean;
  nullAsOptional: boolean;
};

function primitive(value: unknown): string | null {
  if (value === null) return "null";
  if (Array.isArray(value)) return null;
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return Number.isFinite(value) ? "number" : "number";
    case "boolean":
      return "boolean";
    case "object":
      return null;
    default:
      return "unknown";
  }
}

function union(types: string[]): string {
  const unique = [...new Set(types.filter(Boolean))];
  if (unique.length === 0) return "unknown";
  if (unique.length === 1) return unique[0];
  const hasNull = unique.includes("null");
  const rest = unique.filter((type) => type !== "null");
  if (rest.length === 1 && hasNull) return `${rest[0]} | null`;
  return unique.join(" | ");
}

function infer(value: unknown, nameHint: string, ctx: InferCtx): string {
  const simple = primitive(value);
  if (simple) return simple;
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const item = union(value.map((entry) => infer(entry, nameHint, ctx)));
    return item.includes(" ") ? `(${item})[]` : `${item}[]`;
  }
  if (value && typeof value === "object") {
    const name = uniqueName(nameHint, ctx.used);
    const lines: string[] = [];
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const childType = infer(child, pascal(key), ctx);
      if (ctx.nullAsOptional && child === null) {
        lines.push(`  ${quoteKey(key)}?: unknown;`);
        continue;
      }
      if (ctx.nullAsOptional && childType.endsWith(" | null")) {
        lines.push(`  ${quoteKey(key)}?: ${childType.replace(/ \| null$/, "")};`);
        continue;
      }
      lines.push(`  ${quoteKey(key)}: ${childType};`);
    }
    const body = lines.length ? lines.join("\n") : "  // empty object";
    const prefix = ctx.exportTypes ? "export " : "";
    ctx.blocks.push(`${prefix}interface ${name} {\n${body}\n}`);
    return name;
  }
  return "unknown";
}

export function buildTypescript(raw: string, options: JsonTsOptions): JsonTsResult {
  const issues: JsonTsIssue[] = [];
  const trimmed = raw.trim();
  if (!trimmed) {
    return { code: "", issues: [{ level: "error", code: "empty" }], interfaces: 0 };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { code: "", issues: [{ level: "error", code: "invalid" }], interfaces: 0 };
  }
  const ctx: InferCtx = {
    used: new Set(),
    blocks: [],
    exportTypes: options.exportTypes,
    nullAsOptional: options.nullAsOptional,
  };
  const root = infer(parsed, options.rootName || "Item", ctx);
  if (Array.isArray(parsed) && parsed.length === 0) issues.push({ level: "warn", code: "empty-array" });
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length === 0) {
    issues.push({ level: "warn", code: "empty-object" });
  }
  if (!ctx.blocks.length) {
    const prefix = options.exportTypes ? "export " : "";
    return {
      code: `${prefix}type ${pascal(options.rootName || "Item")} = ${root};`,
      issues,
      interfaces: 0,
    };
  }
  if (Array.isArray(parsed)) {
    const prefix = options.exportTypes ? "export " : "";
    ctx.blocks.push(`${prefix}type ${pascal(options.rootName || "Item")} = ${root};`);
  }
  return { code: ctx.blocks.join("\n\n"), issues, interfaces: ctx.blocks.length };
}
