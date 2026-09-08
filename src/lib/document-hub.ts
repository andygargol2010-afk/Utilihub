import { allToolBySlug, type CatalogTool, toolHref } from "./all-tools";

export type DocumentHubStep = {
  slug: string;
  title: string;
  description: string;
};

export const DOCUMENT_HUB = {
  slug: "documentos-y-archivos",
  name: "Documentos y archivos",
  eyebrow: "Prepara, convierte y entrega",
  description: "Un recorrido práctico para limpiar contenido, preparar archivos y convertir documentos sin subirlos a un servidor.",
  outcome: "Del archivo original a un documento ordenado, compatible y listo para compartir.",
  steps: [
    { slug: "limpiar-texto", title: "Limpia el contenido", description: "Quita espacios y saltos redundantes antes de pegar el texto en tu documento." },
    { slug: "contador-de-palabras", title: "Comprueba la extensión", description: "Revisa palabras, caracteres, frases y tiempo de lectura antes de entregar." },
    { slug: "generador-nombres-archivos", title: "Nombra el archivo", description: "Crea un nombre consistente para encontrar y compartir el documento fácilmente." },
    { slug: "imagenes-a-pdf", title: "Convierte imágenes a PDF", description: "Combina capturas o imágenes en un documento PDF desde el navegador." },
    { slug: "unir-pdf", title: "Une los documentos", description: "Integra anexos o páginas separadas en un único PDF ordenado." },
    { slug: "extraer-texto-pdf", title: "Extrae el texto", description: "Recupera el texto seleccionable para reutilizarlo o revisarlo localmente." },
  ] satisfies DocumentHubStep[],
  alternatives: [
    { slug: "png-a-jpg", title: "Convertir PNG a JPG", description: "Reduce incompatibilidades cuando el destino necesita JPG." },
    { slug: "jpg-a-png", title: "Convertir JPG a PNG", description: "Conserva una salida PNG para transparencias o edición posterior." },
    { slug: "pdf-a-imagenes", title: "Convertir PDF a imágenes", description: "Genera una imagen por página para previsualizar o publicar." },
    { slug: "dividir-pdf", title: "Dividir PDF", description: "Extrae una página concreta o separa un documento grande." },
    { slug: "comprimir-imagen", title: "Comprimir imágenes", description: "Reduce el peso de imágenes antes de insertarlas o enviarlas." },
    { slug: "json-formatter", title: "Formatear JSON", description: "Ordena datos JSON para documentarlos o revisarlos con claridad." },
  ] satisfies DocumentHubStep[],
};

export function documentHubTools(steps: DocumentHubStep[]): Array<DocumentHubStep & { tool: CatalogTool; href: string }> {
  return steps.flatMap((step) => {
    const tool = allToolBySlug(step.slug);
    return tool ? [{ ...step, tool, href: toolHref(tool) }] : [];
  });
}
