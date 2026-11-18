// Part 2 of 3 — split from SpanishSiteHeader.tsx on 2026-11-04. Edit here; SpanishSiteHeader.tsx re-exports.

export const activeNav = { className: "bg-secondary text-foreground" };
export const mobileLink = "min-h-11 rounded-md px-3 py-2.5 text-[15px] font-semibold hover:bg-secondary";
export const mobileMuted =
  "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";

/** Secciones que en escritorio quedan bajo "Más" (en el menú móvil siguen todas). */
export const MORE = [
  { href: "/es/kits", label: "Kits" },
  { href: "/es/playgrounds", label: "Playgrounds" },
  { href: "/es/experiences", label: "Experiencias" },
] as const;

/** Atajos de categoría en el desplegable Explorar */
export const BROWSE = [
  { href: "/es/categoria/herramientas-avanzadas", label: "Herramientas avanzadas" },
  { href: "/es/categoria/matematicas", label: "Matemáticas" },
  { href: "/es/categoria/texto", label: "Texto" },
  { href: "/es/categoria/desarrollo", label: "Desarrollo" },
  { href: "/es/finanzas", label: "Finanzas" },
] as const;
