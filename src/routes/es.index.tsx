import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { SpanishToolSearch } from "@/components/SpanishToolSearch";
import { FavoriteToolsSection } from "@/components/FavoriteToolsSection";
import { RecentToolsSection } from "@/components/RecentToolsSection";
import { HomeReviews } from "@/components/HomeReviews";
import { HomeFeaturedSection } from "@/components/HomeFeaturedSection";
import { ALL_CATEGORIES, ALL_TOOLS, allToolsByCategory } from "@/lib/all-tools";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";
import { spanishCategoryName, spanishToolName, spanishToolPath } from "@/lib/i18n/es";

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

const titleEs = "UtiliHub · Herramientas online, studios 3D y juegos";
const descriptionEs =
  "Herramientas online gratis, modelador de casas 3D y juegos en el navegador. Calculá, convertí, diseñá y jugá — sin registro.";

export const Route = createFileRoute("/es/")({
  head: () => ({
    meta: [
      { title: titleEs },
      { name: "description", content: descriptionEs },
      {
        name: "keywords",
        content:
          "herramientas online, modelador casas 3D, juegos gratis navegador, calculadoras, herramientas avanzadas, UtiliHub",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: titleEs },
      { property: "og:description", content: descriptionEs },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titleEs },
      { name: "twitter:description", content: descriptionEs },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
  }),
  component: SpanishHome,
});

function categoryHref(slug: string) {
  if (slug === "finanzas") return "/es/finanzas";
  return `/es/categoria/${slug}`;
}

function SpanishHome() {
  const categories = ALL_CATEGORIES.slice(0, 9);
  const quickTools = QUICK_TOOL_SLUGS.map((s) => ALL_TOOLS.find((t) => t.slug === s)).filter(
    Boolean,
  ) as typeof ALL_TOOLS;

  return (
    <div className="pb-12">
      <section className="hero-gradient border-b border-border/70">
        <div className="container-page grid gap-8 py-10 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
              <Sparkles className="size-3.5" aria-hidden /> Herramientas, studios y juegos
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Herramientas online gratis para resolverlo en segundos.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Calculá y convertí tareas del día a día — más studios 3D avanzados y juegos gratis en el navegador. Sin
              registro.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/es/categoria/$slug"
                params={{ slug: "herramientas-avanzadas" }}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95"
              >
                Explorar avanzadas <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/es/juegos"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-violet-500/40 bg-card px-5 py-3 text-sm font-bold text-violet-800 hover:border-violet-500/60 hover:bg-violet-500/10 dark:text-violet-200"
              >
                Jugar
              </Link>
              <Link
                to="/es/herramientas"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary/40 hover:bg-accent"
              >
                Catálogo completo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Sin registro
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Gratis
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Privacidad local
              </span>
            </div>
          </div>

          <div className="surface-card bg-card/80 p-3 shadow-lift sm:p-4">
            <div className="rounded-xl border border-border/70 bg-background p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Acceso rápido</p>
                  <h2 className="mt-1 text-xl font-black">¿Qué quieres resolver?</h2>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                  {ALL_TOOLS.length} herramientas
                </span>
              </div>
              <div className="mt-4">
                <SpanishToolSearch compactHome />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-3">
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "herramientas-avanzadas" }}
                  className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 hover:border-primary/50 hover:bg-primary/10"
                >
                  Avanzadas
                </Link>
                <Link
                  to="/es/juegos"
                  className="rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 hover:border-violet-500/50 hover:bg-violet-500/10"
                >
                  Juegos
                </Link>
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "matematicas" }}
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Matemáticas
                </Link>
                <Link
                  to="/es/finanzas"
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Finanzas
                </Link>
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "texto" }}
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Texto
                </Link>
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "conversiones" }}
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Conversores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page">
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
            {quickTools.map((tool) => (
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
              const href = categoryHref(category.slug);
              const blurb =
                CATEGORY_BLURB_ES[category.slug] ??
                `Herramientas de ${spanishCategoryName(category.slug).toLowerCase()}.`;
              return (
                <a
                  key={category.slug}
                  href={href}
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
        <HomeReviews locale="es" />
      </div>
    </div>
  );
}
