import { useState } from "react";
import { Check, Download, FileDown, Link2 } from "lucide-react";
import { useShareableParams } from "@/hooks/use-shareable-params";

type ExportRow = { label: string; value: string };

function collectRows(container: HTMLElement): ExportRow[] {
  return Array.from(container.querySelectorAll("input, select, textarea")).map((field) => {
    const el = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const label = el.getAttribute("aria-label") || el.name || el.previousElementSibling?.textContent?.trim() || "Valor";
    return { label, value: el.value };
  }).filter((row) => row.value !== "");
}

function collectResult(container: HTMLElement): string {
  const result = container.querySelector("[data-export-result]");
  return (result?.textContent || container.querySelector("output")?.textContent || "").trim();
}

export function ShareAndExportActions({ title }: { title: string }) {
  const { share } = useShareableParams();
  const [status, setStatus] = useState("");

  const runShare = async () => {
    const ok = await share();
    setStatus(ok ? "Enlace copiado" : "No se pudo copiar el enlace");
    window.setTimeout(() => setStatus(""), 1800);
  };

  const exportPdf = async () => {
    const surface = document.querySelector<HTMLElement>("[data-tool-surface]");
    if (!surface) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ format: "a4", unit: "mm" });
    const rows = collectRows(surface);
    const result = collectResult(surface);
    let y = 20;
    doc.setFontSize(18);
    doc.text(title, 15, y);
    y += 12;
    doc.setFontSize(11);
    for (const row of rows) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(`${row.label}: ${row.value}`, 15, y);
      y += 7;
    }
    if (result) {
      y += 5;
      doc.setFontSize(13);
      doc.text("Resultado", 15, y);
      y += 8;
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(result, 180) as string[];
      for (const line of lines) {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 6;
      }
    }
    doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.pdf`);
  };

  const exportCsv = async () => {
    const surface = document.querySelector<HTMLElement>("[data-tool-surface]");
    if (!surface) return;
    const rows = collectRows(surface);
    const result = collectResult(surface);
    const data = [...rows, ...(result ? [{ label: "Resultado", value: result }] : [])];
    const { utils, writeFile } = await import("xlsx");
    const sheet = utils.json_to_sheet(data);
    const book = utils.book_new();
    utils.book_append_sheet(book, sheet, "UtiliHub");
    writeFile(book, `${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.csv`, { bookType: "csv" });
  };

  return <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4" aria-label="Compartir y exportar">
    <button type="button" onClick={runShare} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><Link2 className="size-4"/> Compartir configuración</button>
    <button type="button" onClick={exportPdf} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><FileDown className="size-4"/> Exportar a PDF</button>
    <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-accent"><Download className="size-4"/> Descargar Excel (.CSV)</button>
    {status && <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check className="size-3.5"/>{status}</span>}
  </div>;
}
