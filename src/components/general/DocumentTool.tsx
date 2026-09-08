import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Operation = "pdf-metadata" | "text-diff" | "csv-inspector" | "markdown-html" | "file-name-batch";
const documentOperationMarkers: Record<Operation, () => true> = { "pdf-metadata": () => true, "text-diff": () => true, "csv-inspector": () => true, "markdown-html": () => true, "file-name-batch": () => true };

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
const normalizeFileName = (value: string) => value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function DocumentTool({ tool }: { tool: GeneralTool }) {
  const operation = String(tool.config?.operation ?? "") as Operation;
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const run = async () => {
    try {
      setError("");
      if (!documentOperationMarkers[operation]?.()) throw Error("Operación documental no disponible.");
      if (operation === "pdf-metadata") {
        if (!file) throw Error("Selecciona un archivo PDF.");
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(await file.arrayBuffer());
        setOutput(`Páginas: ${pdf.getPageCount()}\nTítulo: ${pdf.getTitle() || "Sin título"}\nAutor: ${pdf.getAuthor() || "Sin autor"}\nAsunto: ${pdf.getSubject() || "Sin asunto"}\nTamaño: ${(file.size / 1024).toFixed(1)} KB`);
        return;
      }
      if (operation === "text-diff") {
        if (!first.trim() && !second.trim()) throw Error("Introduce las dos versiones del texto.");
        const a = first.split(/\r?\n/); const b = second.split(/\r?\n/); const max = Math.max(a.length, b.length); const lines: string[] = [];
        for (let i = 0; i < max; i++) if (a[i] !== b[i]) lines.push(`Línea ${i + 1}: ${a[i] ? `− ${a[i]}` : "− (vacía)"}\n${b[i] ? `+ ${b[i]}` : "+ (vacía)"}`);
        setOutput(lines.length ? `${lines.length} línea(s) diferente(s)\n\n${lines.join("\n\n")}` : "Los textos son idénticos línea por línea.");
        return;
      }
      if (operation === "csv-inspector") {
        const text = first.trim(); if (!text) throw Error("Pega el contenido CSV que quieres inspeccionar.");
        const rows = text.split(/\r?\n/).filter(Boolean).map((row) => row.split(",")); const columns = Math.max(...rows.map((row) => row.length));
        const headers = rows[0] ?? []; const duplicateHeaders = headers.filter((header, index) => headers.indexOf(header) !== index);
        setOutput(`Filas: ${rows.length}\nColumnas máximas: ${columns}\nCabeceras: ${headers.join(" | ") || "Sin cabeceras"}\nCabeceras duplicadas: ${duplicateHeaders.length ? [...new Set(duplicateHeaders)].join(", ") : "Ninguna"}\nFilas con columnas incompletas: ${rows.slice(1).filter((row) => row.length !== columns).length}`);
        return;
      }
      if (operation === "markdown-html") {
        if (!first.trim()) throw Error("Introduce Markdown para convertir.");
        const html = first.split(/\r?\n/).map((line) => { const safe = escapeHtml(line); if (safe.startsWith("### ")) return `<h3>${safe.slice(4)}</h3>`; if (safe.startsWith("## ")) return `<h2>${safe.slice(3)}</h2>`; if (safe.startsWith("# ")) return `<h1>${safe.slice(2)}</h1>`; if (!safe.trim()) return ""; return `<p>${safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`; }).join("\n");
        setOutput(html); return;
      }
      if (operation === "file-name-batch") {
        const names = first.split(/\r?\n/).map(normalizeFileName).filter(Boolean); if (!names.length) throw Error("Introduce al menos un nombre o título, uno por línea.");
        setOutput(names.map((name, index) => `${String(index + 1).padStart(2, "0")}-${name}`).join("\n")); return;
      }
      throw Error("Operación documental no disponible.");
    } catch (e) { setOutput(""); setError(e instanceof Error ? e.message : "No se pudo procesar el archivo."); }
  };

  const isFile = operation === "pdf-metadata";
  const isDual = operation === "text-diff";
  const placeholder = operation === "csv-inspector" ? "nombre,correo,estado\nAna,ana@ejemplo.com,activo" : operation === "markdown-html" ? "# Título\n\nTexto **importante**" : "Un nombre o texto por línea";
  return <div className="space-y-4">
    {isFile ? <label className="block space-y-2"><span className="text-sm font-semibold">Archivo PDF</span><input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full rounded-xl border bg-background p-3 text-sm" /></label> : <div className={isDual ? "grid gap-4 sm:grid-cols-2" : ""}><label className="block space-y-2"><span className="text-sm font-semibold">{isDual ? "Versión A" : operation === "csv-inspector" ? "Contenido CSV" : operation === "markdown-html" ? "Markdown" : "Títulos o nombres"}</span><textarea value={first} onChange={(event) => setFirst(event.target.value)} rows={isDual ? 8 : 10} placeholder={placeholder} className="w-full rounded-xl border bg-background p-3 font-mono text-sm" /></label>{isDual && <label className="block space-y-2"><span className="text-sm font-semibold">Versión B</span><textarea value={second} onChange={(event) => setSecond(event.target.value)} rows={8} placeholder="Pega aquí la segunda versión" className="w-full rounded-xl border bg-background p-3 font-mono text-sm" /></label>}</div>}
    <button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar</button>
    {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
    {output && <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm">{output}</pre>}
  </div>;
}
