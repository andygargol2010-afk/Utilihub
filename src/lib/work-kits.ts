import { allToolBySlug, type CatalogTool } from "./all-tools";

export type WorkKit = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  outcome: string;
  toolSlugs: string[];
};

export const WORK_KITS: WorkKit[] = [
  {
    slug: "freelancers",
    name: "Kit para freelancers",
    eyebrow: "Trabaja y entrega mejor",
    description: "Prepara una entrega profesional: revisa el texto, ordena archivos, ajusta imágenes y calcula importes.",
    outcome: "De una idea a una entrega clara y lista para compartir.",
    toolSlugs: ["contador-de-palabras", "slug-generator", "comprimir-imagen", "unir-pdf", "calculadora-de-porcentajes"],
  },
  {
    slug: "seo-y-contenido",
    name: "SEO y contenido",
    eyebrow: "Investiga y publica",
    description: "Limpia y prepara contenido para una página: extensión, URL, expresiones y marcado más ligero.",
    outcome: "Contenido más claro, consistente y fácil de publicar.",
    toolSlugs: ["contador-de-palabras", "slug-generator", "regex-tester", "html-minifier", "calculadora-de-porcentajes"],
  },
  {
    slug: "preparar-documentos",
    name: "Preparar documentos",
    eyebrow: "Antes de enviar",
    description: "Valida datos, convierte formatos y organiza documentos PDF e imágenes directamente en el navegador.",
    outcome: "Documentos más limpios, compatibles y listos para entregar.",
    toolSlugs: ["json-formatter", "json-validator", "unir-pdf", "dividir-pdf", "imagenes-a-pdf", "extraer-texto-pdf"],
  },
  {
    slug: "archivos-y-formatos",
    name: "Archivos y formatos",
    eyebrow: "Convierte sin subir archivos",
    description: "Resuelve las conversiones más habituales entre imágenes, PDF, datos y unidades de almacenamiento.",
    outcome: "El formato correcto para cada destino, con procesamiento local.",
    toolSlugs: ["png-a-jpg", "jpg-a-png", "webp-a-jpg", "pdf-a-imagenes", "imagenes-a-pdf", "conversor-datos"],
  },
  {
    slug: "desarrollo-web",
    name: "Desarrollo web",
    eyebrow: "Depura y transforma datos",
    description: "Formatea, valida, codifica y transforma datos y fragmentos web sin salir del navegador.",
    outcome: "Datos legibles y formatos listos para integrar.",
    toolSlugs: ["json-formatter", "json-validator", "json-minifier", "json-a-csv", "base64-encode", "url-encode", "html-minifier"],
  },
  {
    slug: "estudiantes",
    name: "Herramientas para estudiantes",
    eyebrow: "Estudia con foco",
    description: "Resuelve cálculos, organiza fechas y prepara materiales de estudio con utilidades rápidas.",
    outcome: "Más tiempo para entender y menos para tareas repetitivas.",
    toolSlugs: ["regla-de-tres", "calculadora-de-fechas", "contador-de-palabras", "conversor-de-unidades", "calculadora-de-porcentajes"],
  },
];

export function kitTools(kit: WorkKit): CatalogTool[] {
  return kit.toolSlugs.map(allToolBySlug).filter((tool): tool is CatalogTool => Boolean(tool));
}

export function kitBySlug(slug: string) {
  return WORK_KITS.find((kit) => kit.slug === slug);
}
