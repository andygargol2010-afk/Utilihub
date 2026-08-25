import { useState } from "react";
import { Check, Download, FileDown, Link2 } from "lucide-react";
import { useShareableParams } from "@/hooks/use-shareable-params";

type ExportRow = Record<string, string>;

/** Only controls explicitly marked for export are included. */
function collectRows(container: HTMLElement): ExportRow[] {
  return Array.from(container.querySelectorAll("[data-export-field]"))
    .map((field) => {
      const el = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      return {
        Campo: el.getAttribute("data-export-field") || el.getAttribute("aria-label") || el.name || "Valor",
        Valor: el.value,
      };
    })
    .filter((row) => row.Valor !== "");
}

function collectTable(container: HTMLElement): ExportRow[] {
  const table = container.querySelector<HTMLTableElement>("[data-export-table]");
  if (!table) return [];
  const headers = Array.from(table.querySelectorAll("thead th")).map((cell) => cell.textContent?.trim() || "Columna");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  if (!headers.length || !rows.length) return [];
  return rows.map((row) => {
    const values = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent?.trim() || "");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function collectResult(container: HTMLElement): string {
  return (container.querySelector("[data-export-result]")?.textContent || "").trim();
}

function filename(title: string, extension: string) {
  const safe = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${safe || "utilihub-export"}.${extension}`;
}

export function ShareAndExportActions({ title }: { title: string }) {
  const { share } = useShareableParams();
  const [status, setStatus] = useState("");

  const showStatus = (message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus(""), 1800);
  };

  const runShare = async () => showStatus(await share() ? "Enlace copiado" : "No se pudo copiar el enlace");

  const exportPdf = async () => {
    const surface = document.querySelector<HTMLElement>("[data-tool-surface]");
    if (!surface) return showStatus("No hay datos para exportar");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ format: "a4", unit: "mm" });
      const rows = collectRows(surface);
      const table = collectTable(surface);
      const result = collectResult(surface);
      if (!rows.length && !table.length && !result) return showStatus("Esta herramienta no tiene datos exportables");
      let y = 20;
      doc.setFontSize(18);
      doc.text(title, 15, y);
      y += 12;
      doc.setFontSize(11);
      for (const row of rows) {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(`${row.Campo}: ${row.Valor}`, 15, y);
        y += 7;
      }
      for (const row of table) {
        const line = Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(" | ");
        for (const text of doc.splitTextToSize(line, 180) as string[]) {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(text, 15, y);
          y += 6;
        }
      }
      if (result) {
        y += 5;
        doc.setFontSize(13);
        doc.text("Resultado", 15, y);
        y += 8;
        doc.setFontSize(11);
        for (const line of doc.splitTextToSize(result, 180) as string[]) {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(line, 15, y);
          y += 6;
        }
      }
      doc.save(filename(title, "pdf"));
      showStatus("PDF exportado");
    } catch {
      showStatus("No se pudo exportar el PDF");
    }
  };

  const exportCsv = async () => {
    const surface = document.querySelector<HTMLElement>("[data-tool-surface]");
    if (!surface) return showStatus("No hay datos para exportar");
    try {
      const { utils, writeFile } = await import("xlsx");
      const table = collectTable(surface);
      const rows = table.length ? table : collectRows(surface);
      const result = collectResult(surface);
      const data = result && !table.length ? [...rows, { Campo: "Resultado", Valor: result }] : rows;
      if (!data.length) return showStatus("Esta herramienta no tiene datos exportables");
      const sheet = utils.json_to_sheet(data);
      const book = utils.book_new();
      utils.book_append_sheet(book, sheet, "UtiliHub");
      writeFile(book, filename(title, "csv"), { bookType: "csv" });
      showStatus("CSV descargado");
    } catch {
      showStatus("No se pudo exportar el CSV");
    }
  };

  return <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" aria-label="Compartir y exportar">
    <button type="button" onClick={runShare} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><Link2 className="size-4"/> Compartir configuración</button>
    <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><FileDown className="size-4"/> Exportar a PDF</button>
    <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><Download className="size-4"/> Descargar CSV</button>
    {status && <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check className="size-3.5"/>{status}</span>}
  </div>;
}
