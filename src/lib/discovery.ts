import { type CatalogTool } from "./all-tools";
import type { PublicLocale } from "./route-slugs";
export { TOOL_JOURNEYS } from "./discovery.part1";
export { journeyTools } from "./discovery.part2";

export function journeyLabel(
  current: Pick<CatalogTool, "slug" | "category">,
  locale: PublicLocale = "en",
): string {
  const es = locale === "es";

  if (current.slug === "validador-cuit") {
    return es
      ? "Después del CUIT: validar datos, IDs y formato"
      : "After CUIT: validate data, IDs, and encoding";
  }
  if (current.slug === "validador-iban") {
    return es
      ? "Después del IBAN: otros identificadores y formatos"
      : "After IBAN: other identifiers and formats";
  }
  if (current.slug === "calculadora") {
    return es
      ? "Después de la calculadora: porcentajes y proporciones"
      : "After the calculator: percentages and proportions";
  }
  if (
    current.slug === "porcentaje" ||
    current.slug === "regla-de-tres" ||
    current.slug === "cambio-porcentual" ||
    current.slug === "calculadora-de-porcentajes"
  ) {
    return es ? "Más herramientas de porcentajes y proporciones" : "More proportion and percentage tools";
  }
  if (
    current.slug === "contador-de-palabras" ||
    current.slug === "tiempo-lectura" ||
    current.slug === "calculadora-tiempo-de-lectura"
  ) {
    return es
      ? "Seguí con el texto: tiempo de lectura y limpieza"
      : "Keep going with your text: reading time and cleanup";
  }
  if (current.slug === "pixelihub") {
    return es
      ? "Armá una paleta y seguí diseñando sprites"
      : "Build a palette and keep designing sprites";
  }
  if (current.slug === "modelador-3d" || current.slug === "modelador-casas-3d") {
    return es
      ? "Seguí en el estudio o pasá a diseño y color"
      : "Stay in the studio or move to design and color";
  }
  if (current.category === "seguridad") {
    return es ? "Protegé y verificá tus datos" : "Protect and verify your data";
  }
  if (current.category === "diseno") {
    return es ? "Diseñá y validá tu interfaz" : "Design and validate your interface";
  }
  if (current.category === "utilidades") {
    return es ? "Completá tu cálculo" : "Complete your calculation";
  }
  if (current.category === "finanzas") {
    return es ? "Analizá el siguiente escenario" : "Analyze the next scenario";
  }
  if (current.category === "texto") {
    return es ? "Seguí trabajando tu contenido" : "Keep working on your content";
  }
  if (current.category === "matematicas") {
    return es ? "Herramientas de matemáticas relacionadas" : "Related math tools";
  }
  if (current.category === "desarrollo") {
    return es ? "Herramientas de desarrollo relacionadas" : "Related developer tools";
  }
  if (current.category === "fechas") {
    return es ? "Herramientas de fechas relacionadas" : "Related date tools";
  }
  if (current.category === "productividad") {
    return es ? "Herramientas de productividad relacionadas" : "Related productivity tools";
  }
  return es ? "Continuar con herramientas relacionadas" : "Continue with related tools";
}
