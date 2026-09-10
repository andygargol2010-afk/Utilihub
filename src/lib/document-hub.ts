import { allToolBySlug, type CatalogTool, toolHref } from "./all-tools";

export type DocumentHubStep = {
  slug: string;
  title: string;
  description: string;
};

export const DOCUMENT_HUB = {
  slug: "documentos-y-archivos",
  name: "Documents and files",
  eyebrow: "Prepare, convert, and deliver",
  description: "A practical path to clean content, prepare files, and convert documents without uploading them to a server.",
  outcome: "From the original file to an organized, compatible document ready to share.",
  steps: [
    { slug: "limpiar-texto", title: "Clean the content", description: "Remove redundant spaces and line breaks before pasting the text into your document." },
    { slug: "contador-de-palabras", title: "Check the length", description: "Review words, characters, sentences, and reading time before delivering." },
    { slug: "generador-nombres-archivos", title: "Name the file", description: "Create a consistent name so the document is easy to find and share." },
    { slug: "imagenes-a-pdf", title: "Convert images to PDF", description: "Combine screenshots or images into a PDF document from the browser." },
    { slug: "unir-pdf", title: "Merge the documents", description: "Combine attachments or separate pages into a single ordered PDF." },
    { slug: "extraer-texto-pdf", title: "Extract the text", description: "Recover selectable text to reuse or review it locally." },
  ] satisfies DocumentHubStep[],
  alternatives: [
    { slug: "png-a-jpg", title: "Convert PNG to JPG", description: "Reduce incompatibilities when the destination needs JPG." },
    { slug: "jpg-a-png", title: "Convert JPG to PNG", description: "Keep a PNG output for transparency or later editing." },
    { slug: "pdf-a-imagenes", title: "Convert PDF to images", description: "Generate one image per page for preview or publishing." },
    { slug: "dividir-pdf", title: "Split PDF", description: "Extract a specific page or split a large document." },
    { slug: "comprimir-imagen", title: "Compress images", description: "Reduce image size before inserting or sending them." },
    { slug: "json-formatter", title: "Format JSON", description: "Organize JSON data to document or review it clearly." },
    { slug: "inspector-metadatos-pdf", title: "Inspect PDF metadata", description: "Check pages, title, author, and size before sharing a PDF." },
    { slug: "comparador-de-textos", title: "Compare versions", description: "Detect changes between two document versions line by line." },
    { slug: "inspector-csv", title: "Review a CSV", description: "Detect duplicate headers, incomplete rows, and file dimensions." },
    { slug: "markdown-a-html-avanzado", title: "Convert Markdown to advanced HTML", description: "Transform basic Markdown into safe HTML to copy and publish." },
    { slug: "nombres-de-archivos-en-lote", title: "Normalize names in bulk", description: "Generate consistent names for file lists or deliverables." },
  ] satisfies DocumentHubStep[],
};

export function documentHubTools(steps: DocumentHubStep[]): Array<DocumentHubStep & { tool: CatalogTool; href: string }> {
  return steps.flatMap((step) => {
    const tool = allToolBySlug(step.slug);
    return tool ? [{ ...step, tool, href: toolHref(tool) }] : [];
  });
}
