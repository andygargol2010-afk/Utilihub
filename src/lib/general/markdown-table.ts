/** Turn delimited text into a GitHub-flavored Markdown table. Nothing is uploaded. */

export type DelimiterChoice = "auto" | "comma" | "semicolon" | "tab";
export type AlignChoice = "left" | "center" | "right";

export type MarkdownTableIssue = { level: "error" | "warn"; code: string };

export type MarkdownTableResult = {
  markdown: string;
  issues: MarkdownTableIssue[];
  rows: number;
  columns: number;
  delimiter: "," | ";" | "\t";
};

const EXAMPLE_ROWS = 2;

function detectDelimiter(line: string): "," | ";" | "\t" {
  const counts = {
    ",": (line.match(/,/g) ?? []).length,
    ";": (line.match(/;/g) ?? []).length,
    "\t": (line.match(/\t/g) ?? []).length,
  };
  if (counts[";"] > counts[","] && counts[";"] >= counts["\t"]) return ";";
  if (counts["\t"] > counts[","] && counts["\t"] >= counts[";"]) return "\t";
  return ",";
}

function parseLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quoted) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === delimiter) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

export function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

export function buildMarkdownTable(
  raw: string,
  options: { delimiter: DelimiterChoice; header: boolean; align: AlignChoice },
): MarkdownTableResult {
  const issues: MarkdownTableIssue[] = [];
  const lines = raw
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { markdown: "", issues: [{ level: "error", code: "empty" }], rows: 0, columns: 0, delimiter: "," };
  }

  const delimiter = options.delimiter === "auto" ? detectDelimiter(lines[0]) : options.delimiter === "semicolon" ? ";" : options.delimiter === "tab" ? "\t" : ",";
  const parsed = lines.map((line) => parseLine(line, delimiter));
  const columns = parsed.reduce((max, row) => Math.max(max, row.length), 0);
  if (columns < 2) issues.push({ level: "warn", code: "one-column" });

  const uneven = parsed.some((row) => row.length !== columns);
  if (uneven) issues.push({ level: "warn", code: "uneven" });

  const padded = parsed.map((row) => {
    const next = row.slice();
    while (next.length < columns) next.push("");
    return next.map(escapeCell);
  });

  const separator = options.align === "center" ? ":---:" : options.align === "right" ? "---:" : "---";
  const bodyStart = options.header ? 1 : 0;
  const header = options.header ? padded[0] : Array.from({ length: columns }, (_, index) => `col ${index + 1}`);
  const body = padded.slice(bodyStart);
  if (options.header && body.length === 0) issues.push({ level: "warn", code: "header-only" });

  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  const markdown = [line(header), line(Array.from({ length: columns }, () => separator)), ...body.map(line)].join("\n");

  return { markdown, issues, rows: body.length, columns, delimiter };
}

export const MARKDOWN_TABLE_EXAMPLE = {
  csv: "name,qty\nFlour,500\nWater,320",
  rows: EXAMPLE_ROWS,
};
