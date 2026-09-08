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
    description: "Calcula precios, organiza entregas y prepara textos o archivos sin cambiar de contexto.",
    outcome: "De una idea a una entrega clara y lista para compartir.",
    toolSlugs: ["calculadora-de-porcentajes", "contador-de-palabras", "generador-de-nombres-archivos", "conversor-de-unidades"],
  },
  {
    slug: "seo-y-contenido",
    name: "SEO y contenido",
    eyebrow: "Investiga y publica",
    description: "Limpia, revisa y transforma contenido para preparar una página o una pieza de comunicación.",
    outcome: "Contenido más claro, medible y fácil de reutilizar.",
    toolSlugs: ["contador-de-palabras", "generador-de-nombres-archivos", "generador-de-contrasenas", "calculadora-de-porcentajes"],
  },
  {
    slug: "preparar-documentos",
    name: "Preparar documentos",
    eyebrow: "Antes de enviar",
    description: "Comprueba cantidades, formatos y consistencia antes de entregar un documento o convertirlo.",
    outcome: "Menos errores y una última revisión más rápida.",
    toolSlugs: ["contador-de-palabras", "conversor-de-unidades", "calculadora-de-porcentajes", "generador-de-nombres-archivos"],
  },
  {
    slug: "estudiantes",
    name: "Herramientas para estudiantes",
    eyebrow: "Estudia con foco",
    description: "Resuelve cálculos, controla el tiempo y prepara materiales de estudio desde el navegador.",
    outcome: "Más tiempo para entender y menos para tareas repetitivas.",
    toolSlugs: ["regla-de-tres", "calculadora-de-fechas", "contador-de-palabras", "conversor-de-unidades"],
  },
];

export function kitTools(kit: WorkKit): CatalogTool[] {
  return kit.toolSlugs.map(allToolBySlug).filter((tool): tool is CatalogTool => Boolean(tool));
}

export function kitBySlug(slug: string) {
  return WORK_KITS.find((kit) => kit.slug === slug);
}
