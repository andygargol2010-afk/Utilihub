// Part 2 of 3 — split from AdsenseComplianceKit.tsx on 2026-11-04. Edit here; AdsenseComplianceKit.tsx re-exports.

export type CheckId =
  | "privacy"
  | "about"
  | "contact"
  | "original"
  | "mobile"
  | "nav"
  | "content"
  | "no-prohibited"
  | "https"
  | "sitemap";

export const CHECKS: {
  id: CheckId;
  label: { en: string; es: string };
  tip: { en: string; es: string };
  suggestion: { en: string; es: string };
  weight: number;
}[] = [
  {
    id: "privacy",
    label: { en: "Privacy policy page", es: "Página de política de privacidad" },
    tip: { en: "Link a clear privacy policy from the footer or menu.", es: "Enlaza una política de privacidad clara desde el pie o el menú." },
    suggestion: { en: "Create /privacy with data practices, cookies, and contact.", es: "Crea /privacidad con prácticas de datos, cookies y contacto." },
    weight: 12,
  },
  {
    id: "about",
    label: { en: "About / who we are page", es: "Página Acerca de / quiénes somos" },
    tip: { en: "Tell visitors who is behind the site.", es: "Cuéntale a los visitantes quién está detrás del sitio." },
    suggestion: { en: "Add author bio, mission, and real photo or team note.", es: "Añade biografía del autor, misión y foto real o nota del equipo." },
    weight: 8,
  },
  {
    id: "contact",
    label: { en: "Contact page or form", es: "Página o formulario de contacto" },
    tip: { en: "Provide a way for users and Google to reach you.", es: "Ofrece una forma para que usuarios y Google te contacten." },
    suggestion: { en: "Include email, form, or business address that is monitored.", es: "Incluye email, formulario o dirección de negocio que se supervise." },
    weight: 8,
  },
  {
    id: "original",
    label: { en: "Mostly original content", es: "Contenido mayormente original" },
    tip: { en: "Avoid scraped or thin duplicate pages.", es: "Evita páginas raspadas o duplicadas delgadas." },
    suggestion: { en: "Rewrite thin pages; add unique examples, data, or analysis.", es: "Reescribe páginas delgadas; añade ejemplos, datos o análisis únicos." },
    weight: 18,
  },
  {
    id: "mobile",
    label: { en: "Mobile-friendly layout", es: "Diseño amigable con móviles" },
    tip: { en: "Test on a phone; text readable, buttons tappable.", es: "Prueba en un teléfono; texto legible, botones tocables." },
    suggestion: { en: "Use responsive CSS, 16px+ text, 44px tap targets.", es: "Usa CSS responsivo, texto de 16px+, objetivos de toque de 44px." },
    weight: 12,
  },
  {
    id: "nav",
    label: { en: "Clear navigation", es: "Navegación clara" },
    tip: { en: "Users should find main sections easily.", es: "Los usuarios deben encontrar las secciones principales fácilmente." },
    suggestion: { en: "Add header menu + footer links to key pages.", es: "Añade menú de encabezado + enlaces de pie a páginas clave." },
    weight: 8,
  },
  {
    id: "content",
    label: { en: "Sufficient content quality", es: "Calidad de contenido suficiente" },
    tip: { en: "Aim for helpful, substantial pages, not doorways.", es: "Apunta a páginas útiles y sustanciales, no de entrada." },
    suggestion: { en: "Expand top pages to 800+ words with structure and media.", es: "Amplía las páginas principales a 800+ palabras con estructura y medios." },
    weight: 14,
  },
  {
    id: "no-prohibited",
    label: { en: "No prohibited content", es: "Sin contenido prohibido" },
    tip: { en: "No adult, violent, or policy-violating material.", es: "Sin material adulto, violento o que viole políticas." },
    suggestion: { en: "Remove or age-gate any adult, illegal, or misleading claims.", es: "Elimina o restringe por edad cualquier contenido adulto, ilegal o engañoso." },
    weight: 5,
  },
  {
    id: "https",
    label: { en: "HTTPS / secure site", es: "HTTPS / sitio seguro" },
    tip: { en: "Entire site must load over HTTPS.", es: "Todo el sitio debe cargar por HTTPS." },
    suggestion: { en: "Force HTTPS redirects and fix mixed-content warnings.", es: "Fuerza redirecciones HTTPS y corrige avisos de contenido mixto." },
    weight: 8,
  },
  {
    id: "sitemap",
    label: { en: "Sitemap + robots.txt", es: "Sitemap + robots.txt" },
    tip: { en: "Help Google discover your pages.", es: "Ayuda a Google a descubrir tus páginas." },
    suggestion: { en: "Submit sitemap in Search Console; allow crawling in robots.txt.", es: "Envía el sitemap en Search Console; permite rastreo en robots.txt." },
    weight: 7,
  },
];

export const PRESETS: {
  id: string;
  label: { en: string; es: string };
  checks: CheckId[];
}[] = [
  {
    id: "new",
    label: { en: "New site", es: "Sitio nuevo" },
    checks: ["mobile", "https"],
  },
  {
    id: "content",
    label: { en: "Content site", es: "Sitio de contenido" },
    checks: ["original", "content", "nav", "mobile", "https", "no-prohibited"],
  },
  {
    id: "nearly",
    label: { en: "Nearly ready", es: "Casi listo" },
    checks: ["privacy", "about", "contact", "original", "mobile", "nav", "content", "no-prohibited", "https"],
  },
];

export function readiness(score: number, es: boolean) {
  if (score >= 90) return { label: es ? "Listo para revisión" : "Ready for review", color: "#22c55e" };
  if (score >= 70) return { label: es ? "Casi listo" : "Almost ready", color: "#84cc16" };
  if (score >= 40) return { label: es ? "En progreso" : "Progressing", color: "#eab308" };
  return { label: es ? "Necesita trabajo" : "Needs work", color: "#ef4444" };
}
