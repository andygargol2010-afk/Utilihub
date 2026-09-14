import { allToolBySlug, type CatalogTool, toolHref } from "./all-tools";

export type DocumentHubStep = {
  slug: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
};

export const DOCUMENT_HUB = {
  slug: "documentos-y-archivos",
  name: "Documents and files",
  nameEs: "Documentos y archivos",
  eyebrow: "Prepare, convert, and deliver",
  eyebrowEs: "Prepará, convertí y entregá",
  description: "A practical path to clean content, prepare files, and convert documents without uploading them to a server.",
  descriptionEs: "Un camino práctico para limpiar contenido, preparar archivos y convertir documentos sin subirlos a un servidor.",
  outcome: "From the original file to an organized, compatible document ready to share.",
  outcomeEs: "Del archivo original a un documento ordenado y compatible, listo para compartir.",
  steps: [
    { slug: "limpiar-texto", title: "Clean the content", titleEs: "Limpiá el contenido", description: "Remove redundant spaces and line breaks before pasting the text into your document.", descriptionEs: "Eliminá espacios y saltos de línea de más antes de pegar el texto en tu documento." },
    { slug: "contador-de-palabras", title: "Check the length", titleEs: "Revisá la extensión", description: "Review words, characters, sentences, and reading time before delivering.", descriptionEs: "Revisá palabras, caracteres, oraciones y tiempo de lectura antes de entregar." },
    { slug: "generador-nombres-archivos", title: "Name the file", titleEs: "Nombrá el archivo", description: "Create a consistent name so the document is easy to find and share.", descriptionEs: "Creá un nombre consistente para que el documento sea fácil de encontrar y compartir." },
    { slug: "imagenes-a-pdf", title: "Convert images to PDF", titleEs: "Convertí imágenes a PDF", description: "Combine screenshots or images into a PDF document from the browser.", descriptionEs: "Combiná capturas o imágenes en un PDF desde el navegador." },
    { slug: "unir-pdf", title: "Merge the documents", titleEs: "Uní los documentos", description: "Combine attachments or separate pages into a single ordered PDF.", descriptionEs: "Combiná adjuntos o páginas sueltas en un solo PDF ordenado." },
    { slug: "extraer-texto-pdf", title: "Extract the text", titleEs: "Extraé el texto", description: "Recover selectable text to reuse or review it locally.", descriptionEs: "Recuperá texto seleccionable para reutilizarlo o revisarlo en local." },
  ] satisfies DocumentHubStep[],
  alternatives: [
    { slug: "png-a-jpg", title: "Convert PNG to JPG", titleEs: "Convertí PNG a JPG", description: "Reduce incompatibilities when the destination needs JPG.", descriptionEs: "Reducí incompatibilidades cuando el destino necesita JPG." },
    { slug: "jpg-a-png", title: "Convert JPG to PNG", titleEs: "Convertí JPG a PNG", description: "Keep a PNG output for transparency or later editing.", descriptionEs: "Mantené salida PNG para transparencia o edición posterior." },
    { slug: "pdf-a-imagenes", title: "Convert PDF to images", titleEs: "Convertí PDF a imágenes", description: "Generate one image per page for preview or publishing.", descriptionEs: "Generá una imagen por página para vista previa o publicación." },
    { slug: "dividir-pdf", title: "Split PDF", titleEs: "Dividí el PDF", description: "Extract a specific page or split a large document.", descriptionEs: "Extraé una página específica o dividí un documento grande." },
    { slug: "comprimir-imagen", title: "Compress images", titleEs: "Comprimí imágenes", description: "Reduce image size before inserting or sending them.", descriptionEs: "Reducí el peso de las imágenes antes de insertarlas o enviarlas." },
    { slug: "json-formatter", title: "Format JSON", titleEs: "Formateá JSON", description: "Organize JSON data to document or review it clearly.", descriptionEs: "Organizá datos JSON para documentarlos o revisarlos con claridad." },
    { slug: "inspector-metadatos-pdf", title: "Inspect PDF metadata", titleEs: "Inspeccioná metadatos PDF", description: "Check pages, title, author, and size before sharing a PDF.", descriptionEs: "Revisá páginas, título, autor y tamaño antes de compartir un PDF." },
    { slug: "comparador-de-textos", title: "Compare versions", titleEs: "Compará versiones", description: "Detect changes between two document versions line by line.", descriptionEs: "Detectá cambios entre dos versiones de un documento línea por línea." },
    { slug: "inspector-csv", title: "Review a CSV", titleEs: "Revisá un CSV", description: "Detect duplicate headers, incomplete rows, and file dimensions.", descriptionEs: "Detectá encabezados duplicados, filas incompletas y dimensiones del archivo." },
    { slug: "markdown-a-html-avanzado", title: "Convert Markdown to advanced HTML", titleEs: "Convertí Markdown a HTML avanzado", description: "Transform basic Markdown into safe HTML to copy and publish.", descriptionEs: "Transformá Markdown básico en HTML seguro para copiar y publicar." },
    { slug: "nombres-de-archivos-en-lote", title: "Normalize names in bulk", titleEs: "Normalizá nombres en lote", description: "Generate consistent names for file lists or deliverables.", descriptionEs: "Generá nombres consistentes para listas de archivos o entregables." },
  ] satisfies DocumentHubStep[],
};

export function documentHubTools(steps: DocumentHubStep[]): Array<DocumentHubStep & { tool: CatalogTool; href: string }> {
  return steps.flatMap((step) => {
    const tool = allToolBySlug(step.slug);
    return tool ? [{ ...step, tool, href: toolHref(tool) }] : [];
  });
}
