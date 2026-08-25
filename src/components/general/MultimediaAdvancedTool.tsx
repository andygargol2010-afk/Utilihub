import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import type { GeneralTool } from "@/lib/general/types";

const IMAGE_TOOLS = new Set([
  "redimensionar-imagen", "comprimir-imagen", "png-a-jpg", "jpg-a-png", "webp-a-jpg",
  "jpg-a-webp", "favicon", "recortar-imagen", "rotar-imagen", "escala-grises", "color-dominante",
]);
const PDF_TOOLS = new Set(["unir-pdf", "dividir-pdf", "imagenes-a-pdf", "pdf-a-imagenes", "rotar-pdf", "reordenar-pdf", "extraer-texto-pdf"]);

const blobFromCanvas = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo generar el archivo.")), type, quality));

export function MultimediaAdvancedTool({ tool }: { tool: GeneralTool }) {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [download, setDownload] = useState<{ url: string; name: string } | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quality, setQuality] = useState("0.8");

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const processImage = async () => {
    if (!file) { setOutput("Selecciona una imagen."); return; }
    try {
      const source = URL.createObjectURL(file);
      const image = new Image();
      image.src = source;
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("No se pudo leer la imagen.")); });
      URL.revokeObjectURL(source);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas no disponible en este navegador.");
      let w = image.naturalWidth;
      let h = image.naturalHeight;
      let type = "image/png";
      let extension = "png";

      if (tool.slug === "redimensionar-imagen" || tool.slug === "recortar-imagen") {
        w = Number(width); h = Number(height);
        if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) throw new Error("Introduce ancho y alto válidos.");
        if (tool.slug === "recortar-imagen" && (w > image.naturalWidth || h > image.naturalHeight)) throw new Error("El recorte no puede superar las dimensiones originales.");
      }
      if (tool.slug === "rotar-imagen") [w, h] = [image.naturalHeight, image.naturalWidth];
      canvas.width = w; canvas.height = h;
      if (tool.slug === "rotar-imagen") {
        ctx.translate(w / 2, h / 2); ctx.rotate(Math.PI / 2);
        ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      } else if (tool.slug === "recortar-imagen") {
        const sx = Math.floor((image.naturalWidth - w) / 2), sy = Math.floor((image.naturalHeight - h) / 2);
        ctx.drawImage(image, sx, sy, w, h, 0, 0, w, h);
      } else {
        ctx.drawImage(image, 0, 0, w, h);
      }

      if (tool.slug === "escala-grises") {
        const pixels = ctx.getImageData(0, 0, w, h);
        for (let i = 0; i < pixels.data.length; i += 4) {
          const gray = Math.round(0.299 * pixels.data[i] + 0.587 * pixels.data[i + 1] + 0.114 * pixels.data[i + 2]);
          pixels.data[i] = gray; pixels.data[i + 1] = gray; pixels.data[i + 2] = gray;
        }
        ctx.putImageData(pixels, 0, 0);
      }
      if (tool.slug === "color-dominante") {
        const sampleW = Math.min(w, 200), sampleH = Math.min(h, 200);
        canvas.width = sampleW; canvas.height = sampleH; ctx.drawImage(image, 0, 0, sampleW, sampleH);
        const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < pixels.length; i += 16) { r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2]; count++; }
        const hex = [r / count, g / count, b / count].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
        setOutput(`Color dominante aproximado: #${hex}`); setDownload(null); return;
      }
      if (["png-a-jpg", "webp-a-jpg", "comprimir-imagen"].includes(tool.slug)) { type = "image/jpeg"; extension = "jpg"; }
      else if (tool.slug === "jpg-a-webp") { type = "image/webp"; extension = "webp"; }
      else if (tool.slug === "favicon") { canvas.width = 32; canvas.height = 32; ctx.drawImage(image, 0, 0, 32, 32); }
      const q = tool.slug === "comprimir-imagen" ? Math.min(0.95, Math.max(0.1, Number(quality))) : 0.92;
      const blob = await blobFromCanvas(canvas, type, q);
      const url = URL.createObjectURL(blob);
      setPreview(url); setOutput(`Archivo generado: ${(blob.size / 1024).toFixed(1)} KB.`); setDownload({ url, name: `${tool.slug}.${extension}` });
    } catch (error) { setOutput(error instanceof Error ? error.message : "No se pudo procesar la imagen."); }
  };

  const imagesToPdf = async () => {
    if (files.length === 0) { setOutput("Selecciona al menos una imagen."); return; }
    try {
      const pdf = new jsPDF({ unit: "px", format: "a4" });
      for (let index = 0; index < files.length; index++) {
        const source = URL.createObjectURL(files[index]);
        const image = new Image(); image.src = source;
        await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error(`No se pudo leer ${files[index].name}.`)); });
        URL.revokeObjectURL(source);
        const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
        const scale = Math.min(pageW / image.naturalWidth, pageH / image.naturalHeight);
        const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
        if (index > 0) pdf.addPage();
        pdf.addImage(image, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      }
      const blob = pdf.output("blob"); const url = URL.createObjectURL(blob);
      setDownload({ url, name: "imagenes.pdf" }); setOutput(`PDF generado con ${files.length} página${files.length === 1 ? "" : "s"}.`);
    } catch (error) { setOutput(error instanceof Error ? error.message : "No se pudo generar el PDF."); }
  };

  if (tool.slug === "imagenes-a-pdf") return <div className="space-y-4 rounded-xl border p-5"><div><h2 className="font-semibold">Imágenes a PDF</h2><p className="text-sm text-muted-foreground">Las imágenes se convierten completamente en tu navegador.</p></div><input type="file" accept="image/*" multiple onChange={(e) => { setFiles(Array.from(e.target.files ?? [])); setDownload(null); setOutput(""); }} /><button onClick={() => void imagesToPdf()} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Crear PDF</button>{output && <output className="block rounded-xl border p-4">{output}</output>}{download && <a href={download.url} download={download.name} className="inline-block rounded-xl border px-4 py-2 font-semibold">Descargar PDF</a>}</div>;

  if (PDF_TOOLS.has(tool.slug)) return <div className="rounded-xl border border-dashed p-5"><h2 className="font-semibold">{tool.name}</h2><p className="mt-1 text-sm text-muted-foreground">Este manipulador PDF está preparado como utilidad local, pero su motor específico todavía está en mantenimiento. No se simulan resultados.</p></div>;
  if (!IMAGE_TOOLS.has(tool.slug)) return <div className="rounded-xl border p-5"><h2 className="font-semibold">Herramienta multimedia no registrada</h2><p className="mt-1 text-sm text-muted-foreground">No existe una implementación multimedia segura para este identificador.</p></div>;

  return <div className="space-y-4"><label className="block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center"><input type="file" accept="image/*" className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setDownload(null); setOutput(""); }} /><span className="font-semibold">Seleccionar imagen</span><span className="mt-1 block text-sm text-muted-foreground">Procesamiento 100% local.</span></label>{file && <div className="space-y-3 rounded-xl border bg-muted/30 p-4"><p className="font-semibold">{file.name}</p>{preview && <img src={preview} alt="Vista previa" className="max-h-64 max-w-full rounded-lg object-contain" />}{["redimensionar-imagen", "recortar-imagen"].includes(tool.slug) && <div className="grid gap-3 sm:grid-cols-2"><input type="number" min="1" placeholder="Ancho (px)" value={width} onChange={(e) => setWidth(e.target.value)} className="h-11 rounded-xl border bg-background px-3" /><input type="number" min="1" placeholder="Alto (px)" value={height} onChange={(e) => setHeight(e.target.value)} className="h-11 rounded-xl border bg-background px-3" /></div>}{tool.slug === "comprimir-imagen" && <label className="block text-sm">Calidad<input type="number" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(e.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label>}<button onClick={() => void processImage()} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Procesar imagen</button>{output && <output className="block rounded-xl border p-4">{output}</output>}{download && <a href={download.url} download={download.name} className="inline-block rounded-xl border px-4 py-2 font-semibold">Descargar resultado</a>}</div>}</div>;
}
