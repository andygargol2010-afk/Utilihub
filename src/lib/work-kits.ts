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
    name: "Freelancer kit",
    eyebrow: "Work and deliver better",
    description: "Prepare a professional delivery: review text, organize files, adjust images, and calculate amounts.",
    outcome: "From an idea to a clear delivery ready to share.",
    toolSlugs: ["contador-de-palabras", "slug-generator", "comprimir-imagen", "unir-pdf", "calculadora-de-porcentajes"],
  },
  {
    slug: "seo-y-contenido",
    name: "SEO and content",
    eyebrow: "Research and publish",
    description: "Clean and prepare content for a page: length, URL, expressions, and lighter markup.",
    outcome: "Clearer, more consistent content that is easier to publish.",
    toolSlugs: ["contador-de-palabras", "slug-generator", "regex-tester", "html-minifier", "calculadora-de-porcentajes"],
  },
  {
    slug: "preparar-documentos",
    name: "Prepare documents",
    eyebrow: "Before you send",
    description: "Validate data, convert formats, and organize PDF documents and images directly in the browser.",
    outcome: "Cleaner, more compatible documents ready to deliver.",
    toolSlugs: ["json-formatter", "json-validator", "unir-pdf", "dividir-pdf", "imagenes-a-pdf", "extraer-texto-pdf"],
  },
  {
    slug: "archivos-y-formatos",
    name: "Files and formats",
    eyebrow: "Convert without uploading files",
    description: "Handle the most common conversions between images, PDF, data, and storage units.",
    outcome: "The right format for each destination, with local processing.",
    toolSlugs: ["png-a-jpg", "jpg-a-png", "webp-a-jpg", "pdf-a-imagenes", "imagenes-a-pdf", "conversor-datos"],
  },
  {
    slug: "desarrollo-web",
    name: "Web development",
    eyebrow: "Debug and transform data",
    description: "Format, validate, encode, and transform data and web snippets without leaving the browser.",
    outcome: "Readable data and formats ready to integrate.",
    toolSlugs: ["json-formatter", "json-validator", "json-minifier", "json-a-csv", "base64-encode", "url-encode", "html-minifier"],
  },
  {
    slug: "estudiantes",
    name: "Student tools",
    eyebrow: "Study with focus",
    description: "Solve calculations, organize dates, and prepare study materials with fast utilities.",
    outcome: "More time to understand and less on repetitive tasks.",
    toolSlugs: ["regla-de-tres", "calculadora-de-fechas", "contador-de-palabras", "conversor-de-unidades", "calculadora-de-porcentajes"],
  },
];

export function kitTools(kit: WorkKit): CatalogTool[] {
  return kit.toolSlugs.map(allToolBySlug).filter((tool): tool is CatalogTool => Boolean(tool));
}

export function kitBySlug(slug: string) {
  return WORK_KITS.find((kit) => kit.slug === slug);
}
