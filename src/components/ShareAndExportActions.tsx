import { useState } from "react";
import { Check, Download, FileDown, Link2 } from "lucide-react";
import { useShareableParams } from "@/hooks/use-shareable-params";

type ExportRow = Record<string, string>;
type Locale = "en" | "es";

function collectRows(container: HTMLElement): ExportRow[] {
  return Array.from(container.querySelectorAll("[data-export-field]"))
    .map((field) => {
      const el = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      return { Field: el.getAttribute("data-export-field") || el.getAttribute("aria-label") || el.name || "Value", Value: el.value };
    })
    .filter((row) => row.Value !== "");
}

function collectTable(container: HTMLElement): ExportRow[] {
  const table = container.querySelector<HTMLTableElement>("[data-export-table]");
  if (!table) return [];
  const headers = Array.from(table.querySelectorAll("thead th")).map((cell) => cell.textContent?.trim() || "Column");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  if (!headers.length || !rows.length) return [];
  return rows.map((row) => {
    const values = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent?.trim() || "");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function collectResult(container: HTMLElement): string {
  return Array.from(container.querySelectorAll("[data-export-result]"))
    .map((element) => element.textContent?.trim() || "")
    .filter(Boolean)
    .join("\n");
}

function filename(title: string, extension: string) {
  const safe = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${safe || "utilihub-export"}.${extension}`;
}

export function ShareAndExportActions({ title, locale = "en" }: { title: string; locale?: Locale }) {
  const { share } = useShareableParams();
  const [status, setStatus] = useState("");
  const copy = locale === "es"
    ? { share: "Compartir configuración", pdf: "Exportar a PDF", csv: "Descargar CSV", aria: "Compartir y exportar", copied: "Enlace copiado", copyError: "No se pudo copiar el enlace", noData: "No hay datos para exportar", empty: "Esta herramienta no tiene datos exportables", pdfOk: "PDF exportado", csvOk: "CSV descargado", exportError: "No se pudo exportar" }
    : { share: "Share configuration", pdf: "Export to PDF", csv: "Download CSV", aria: "Share and export", copied: "Link copied", copyError: "Could not copy the link", noData: "No data to export", empty: "This tool has no exportable data", pdfOk: "PDF exported", csvOk: "CSV downloaded", exportError: "Could not export" };
  const showStatus = (message: string) => { setStatus(message); window.setTimeout(() => setStatus(""), 1800); };
  const runShare = async () => showStatus(await share() ? copy.copied : copy.copyError);

  const exportPdf = async () => {
    const surface = document.querySelector<HTMLElement>("[data-tool-surface]");
    if (!surface) return showStatus(copy.noData);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ format: "a4", unit: "mm" });
      const rows = collectRows(surface), table = collectTable(surface), result = collectResult(surface);
      if (!rows.length && !table.length && !result) return showStatus(copy.empty);
      let y = 20;
      doc.setFontSize(18); doc.text(title, 15, y); y += 12; doc.setFontSize(11);
      for (const row of rows) { if (y > 275) { doc.addPage(); y = 20; } doc.text(`${row.Field}: ${row.Value}`, 15, y); y += 7; }
      for (const row of table) for (const text of doc.splitTextToSize(Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(" | "), 180) as string[]) { if (y > 275) { doc.addPage(); y = 20; } doc.text(text, 15, y); y += 6; }
      if (result) { y += 5; doc.setFontSize(13); doc.text(locale === "es" ? "Resultado" : "Result", 15, y); y += 8; doc.setFontSize(11); for (const line of doc.splitTextToSize(result, 180) as string[]) { if (y > 275) { doc.addPage(); y = 20; } doc.text(line, 15, y); y += 6; } }
      doc.save(filename(title, "pdf")); showStatus(copy.pdfOk);
    } catch { showStatus(copy.exportError); }
  };

  const exportCsv = async () => {
    const surface = document.querySelector<HTMLElement>("[data-tool-surface]");
    if (!surface) return showStatus(copy.noData);
    try {
      const { utils, writeFile } = await import("xlsx");
      const table = collectTable(surface), rows = table.length ? table : collectRows(surface), result = collectResult(surface);
      const data = result && !table.length ? [...rows, { Field: locale === "es" ? "Resultado" : "Result", Value: result }] : rows;
      if (!data.length) return showStatus(copy.empty);
      const sheet = utils.json_to_sheet(data), book = utils.book_new();
      utils.book_append_sheet(book, sheet, "UtiliHub"); writeFile(book, filename(title, "csv"), { bookType: "csv" }); showStatus(copy.csvOk);
    } catch { showStatus(copy.exportError); }
  };

  return <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" aria-label={copy.aria}>
    <button type="button" onClick={runShare} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><Link2 className="size-4"/> {copy.share}</button>
    <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><FileDown className="size-4"/> {copy.pdf}</button>
    <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><Download className="size-4"/> {copy.csv}</button>
    {status && <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check className="size-3.5"/>{status}</span>}
  </div>;
}
