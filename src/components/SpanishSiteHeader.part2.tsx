// Part 2 of 3 — split from SpanishSiteHeader.tsx on 2026-11-04. Edit here; SpanishSiteHeader.tsx re-exports.

export const activeNav = { className: "bg-accent text-primary ring-1 ring-primary/70" };
export const mobileLink = "min-h-11 rounded-lg px-3 py-2.5 text-sm font-bold hover:bg-accent";
export const mobileMuted =
  "min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";

/** Atajos de categoría en el desplegable Explorar */
export const BROWSE = [
  { href: "/es/categoria/herramientas-avanzadas", label: "Herramientas avanzadas" },
  { href: "/es/categoria/matematicas", label: "Matemáticas" },
  { href: "/es/categoria/texto", label: "Texto" },
  { href: "/es/categoria/desarrollo", label: "Desarrollo" },
  { href: "/es/finanzas", label: "Finanzas" },
] as const;
