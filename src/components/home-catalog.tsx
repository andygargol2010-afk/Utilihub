import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FavoriteToolsSection } from "@/components/FavoriteToolsSection";
import { HomeFeaturedSection } from "@/components/HomeFeaturedSection";
import { RecentToolsSection } from "@/components/RecentToolsSection";
import { SpanishToolSearch } from "@/components/SpanishToolSearch";
import { ToolSearch } from "@/components/ToolSearch";
import { ALL_CATEGORIES, ALL_TOOLS, allToolsByCategory } from "@/lib/all-tools";
import { spanishCategoryName, spanishToolName, spanishToolPath } from "@/lib/i18n/es";
import { englishCategorySlug, englishToolSlug } from "@/lib/route-slugs";

const QUICK_TOOL_SLUGS = [
  "calculadora",
  "calculadora-de-porcentajes",
  "regla-de-tres",
  "calculadora-de-fechas",
  "contador-de-palabras",
  "generador-de-contrasenas",
  "conversor-de-temperatura",
  "conversor-de-unidades",
];

/** Short ES blurbs for home category cards (catalog descriptions are English-only). */
const CATEGORY_BLURB_ES: Record<string, string> = {
  finanzas: "Inversiones, préstamos, ahorro e inflación.",
  matematicas: "Cálculos, porcentajes, geometría y estadística.",
  texto: "Contar, limpiar, transformar y analizar texto.",
  desarrollo: "JSON, Base64, hashes, IDs y utilidades para devs.",
  conversiones: "Unidades, color, divisas y más conversiones.",
  fechas: "Diferencias de fechas, edades y temporizadores.",
  generadores: "Contraseñas, UUID, QR y datos aleatorios.",
  diseno: "Colores, contraste, paletas y modelado.",
  "herramientas-avanzadas": "Modeladores 3D y utilidades avanzadas.",
  seguridad: "Contraseñas, hashes y validadores.",
  ciencia: "Física, química y simulaciones.",
  productividad: "Temporizadores, fechas y organización.",
  educacion: "Práctica y ejercicios de estudio.",
  cocina: "Recetas, porciones y conversiones de cocina.",
  viajes: "Combustible, divisas y planificación.",
  hogar: "Pintura, materiales y cálculos del hogar.",
  utilidades: "Utilidades prácticas del día a día.",
};

function categoryHrefEs(slug: string) {
  if (slug === "finanzas") return "/es/finanzas";
  return `/es/categoria/${slug}`;
}

function quickTools() {
  return QUICK_TOOL_SLUGS.map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug)).filter(
    (tool): tool is (typeof ALL_TOOLS)[number] => Boolean(tool),
  );
}

/** Count badge in the hero card. Catalog stays out of the home route chunk. */
export function HomeToolCount({ locale }: { locale: "en" | "es" }) {
  const label = locale === "es" ? `${ALL_TOOLS.length} herramientas` : `${ALL_TOOLS.length} tools`;
  return <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">{label}</span>;
}

export function HomeSearch({ locale }: { locale: "en" | "es" }) {
  return locale === "es" ? <SpanishToolSearch compactHome /> : <ToolSearch compactHome />;
}

export function HomeCatalogRest({ locale }: { locale: "en" | "es" }) {
  const categories = ALL_CATEGORIES.slice(0, 9);
  const tools = quickTools();
  if (locale === "es") {
    return (
      <>
        <HomeFeaturedSection locale="es" />
        <section className="pt-10 pb-10 sm:pt-12 sm:pb-12" aria-labelledby="es-shortcuts-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Empieza aquí</p>
              <h2 id="es-shortcuts-title" className="mt-1 text-2xl font-black sm:text-3xl">
                Enlaces rápidos
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Las herramientas más prácticas para empezar sin recorrer todo el catálogo.
              </p>
            </div>
            <Link
              to="/es/herramientas"
              className="hidden min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent sm:inline-flex"
            >
              Ver catálogo <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                to={spanishToolPath(tool) as never}
                className="card-hover group rounded-xl border border-border/70 bg-card p-4 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-primary">
                  {spanishCategoryName(tool.category)}
                </span>
                <h3 className="mt-2 font-bold group-hover:text-primary">{spanishToolName(tool)}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {CATEGORY_BLURB_ES[tool.category] ?? "Herramienta gratuita en el navegador."}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-10 border-t border-border/70 py-10" aria-labelledby="es-explore-categories">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Explora por objetivo</p>
              <h2 id="es-explore-categories" className="mt-1 text-2xl font-black">
                Todas las categorías
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Colecciones de herramientas organizadas por tipo de tarea.
              </p>
            </div>
            <Link
              to="/es/herramientas"
              className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent"
            >
              Ver todas <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = allToolsByCategory(category.slug).length;
              const blurb =
                CATEGORY_BLURB_ES[category.slug] ??
                `Herramientas de ${spanishCategoryName(category.slug).toLowerCase()}.`;
              return (
                <a
                  key={category.slug}
                  href={categoryHrefEs(category.slug)}
                  className="card-hover group flex min-h-16 items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/20 hover:bg-accent"
                >
                  <span>
                    <span className="block font-bold group-hover:text-primary">
                      {spanishCategoryName(category.slug)}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{blurb}</span>
                  </span>
                  <span className="ml-3 shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-muted-foreground">
                    {count}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
        <FavoriteToolsSection locale="es" />
        <RecentToolsSection locale="es" />
      </>
    );
  }

  return (
    <>
      <HomeFeaturedSection locale="en" />
      <section className="pt-10 pb-10 sm:pt-12 sm:pb-12" aria-labelledby="shortcuts-title">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Start here</p>
            <h2 id="shortcuts-title" className="mt-1 text-2xl font-black sm:text-3xl">
              Quick links
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The most practical tools to start without browsing the full catalog.
            </p>
          </div>
          <Link
            to="/tools"
            className="hidden min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent sm:inline-flex"
          >
            View catalog <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              to={tool.category === "finanzas" ? "/finance/$slug" : "/tools/$slug"}
              params={{ slug: englishToolSlug(tool) }}
              className="card-hover group rounded-xl border border-border/70 bg-card p-4 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-primary">{tool.category}</span>
              <h3 className="mt-2 font-bold group-hover:text-primary">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-10 border-t border-border/70 py-10" aria-labelledby="explore-categories">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Explore by goal</p>
            <h2 id="explore-categories" className="mt-1 text-2xl font-black">
              All categories
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Find a collection of tools organized by task.</p>
          </div>
          <Link to="/tools" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = allToolsByCategory(category.slug).length;
            const href = category.slug === "finanzas" ? "/finance" : `/category/${englishCategorySlug(category.slug)}`;
            return (
              <a
                key={category.slug}
                href={href}
                className="card-hover group flex min-h-16 items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/20 hover:bg-accent"
              >
                <span>
                  <span className="block font-bold group-hover:text-primary">{category.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{category.description}</span>
                </span>
                <span className="ml-3 shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-muted-foreground">
                  {count}
                </span>
              </a>
            );
          })}
        </div>
      </section>
      <FavoriteToolsSection />
      <RecentToolsSection />
    </>
  );
}
