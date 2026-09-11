import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Search } from "lucide-react";
import { ALL_CATEGORIES, ALL_TOOLS } from "@/lib/all-tools";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";
import { spanishCategoryName, spanishToolName, spanishToolPath } from "@/lib/i18n/es";

export const Route = createFileRoute("/es/")({
  head: () => ({
    meta: [
      { title: "Herramientas online gratis | UtiliHub" },
      { name: "description", content: "Herramientas online gratuitas para calcular, convertir, estudiar y resolver tareas cotidianas." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Herramientas online gratis | UtiliHub" },
      { property: "og:description", content: "Calculadoras, conversores y utilidades gratuitas en español." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
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

function SpanishHome() {
  const categories = ALL_CATEGORIES.slice(0, 9);
  const featured = ALL_TOOLS.slice(0, 8);
  return <main className="pb-12">
    <section className="hero-gradient border-b border-border/70">
      <div className="container-page py-10 sm:py-16 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">UtiliHub en español</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Resuelve lo que necesitas en segundos.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Calcula, convierte, estudia y resuelve tareas cotidianas con herramientas gratuitas directamente en tu navegador.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link to="/es/herramientas" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Ver herramientas <ArrowRight className="size-4" /></Link><Link to="/es/finanzas" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold">Calculadoras financieras</Link></div>
      </div>
    </section>
    <div className="container-page">
      <section className="py-10 sm:py-12" aria-labelledby="es-categories"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Explora</p><h2 id="es-categories" className="mt-1 text-2xl font-black">Categorías</h2><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Link key={category.slug} to="/es/herramientas" className="group flex min-h-16 items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/40 hover:bg-accent"><span className="font-bold group-hover:text-primary">{spanishCategoryName(category.slug)}</span><span className="text-xs text-muted-foreground">Ver</span></Link>)}</div></section>
      <section className="border-t border-border/70 py-10" aria-labelledby="es-featured"><div className="flex items-center gap-2"><Calculator className="size-5 text-primary" /><h2 id="es-featured" className="text-2xl font-black">Herramientas destacadas</h2></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((tool) => <Link key={tool.slug} to={spanishToolPath(tool) as any} className="rounded-xl border border-border/70 bg-card p-4 hover:border-primary/45"><h3 className="font-bold">{spanishToolName(tool)}</h3><p className="mt-1 text-xs text-muted-foreground">{spanishCategoryName(tool.category)}</p></Link>)}</div></section>
      <section className="rounded-2xl border border-border/70 bg-surface/55 p-5 sm:p-6"><div className="flex items-center gap-3"><Search className="size-5 text-primary" /><div><h2 className="font-black">¿Qué necesitas resolver?</h2><p className="mt-1 text-sm text-muted-foreground">Consulta todo el catálogo de UtiliHub en español.</p></div></div><Link to="/es/herramientas" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Buscar herramientas <ArrowRight className="size-4" /></Link></section>
    </div>
  </main>;
}
