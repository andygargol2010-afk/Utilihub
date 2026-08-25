import { escapeXml, parseCsvRows, type CsvSeparator } from "./dev-extra-engines";

export function generateHtmlTableWithOptions(input: string, separator: CsvSeparator, firstRowIsHeader: boolean): string {
  const rows = parseCsvRows(input, separator).filter((row) => row.some((cell) => cell.length > 0));
  if (!rows.length) throw new Error("Introduce datos tabulares.");
  const expected = rows[0].length;
  const inconsistent = rows.findIndex((row) => row.length !== expected);
  if (inconsistent !== -1) throw new Error(`Fila ${inconsistent + 1} inconsistente: tiene ${rows[inconsistent].length} columnas y se esperaban ${expected}. Corrige los datos antes de generar la tabla.`);
  const cell = (value: string, tag: "td" | "th") => `<${tag}>${escapeXml(value, "content")}</${tag}>`;
  const header = firstRowIsHeader ? `  <thead><tr>${rows[0].map((value) => cell(value, "th")).join("")}</tr></thead>\n` : "";
  const bodyRows = (firstRowIsHeader ? rows.slice(1) : rows).map((row) => `    <tr>${row.map((value) => cell(value, "td")).join("")}</tr>`).join("\n");
  return `<table>\n${header}  <tbody>\n${bodyRows}\n  </tbody>\n</table>`;
}
