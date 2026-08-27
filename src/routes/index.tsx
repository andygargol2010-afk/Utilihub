import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { ToolSearch } from "@/components/ToolSearch";
import { FavoriteToolsSection } from "@/components/FavoriteToolsSection";
import { RecentToolsSection } from "@/components/RecentToolsSection";
import { ALL_CATEGORIES, ALL_TOOLS, allToolsByCategory } from "@/lib/all-tools";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, websiteSchema } from "@/lib/seo";

const title = "UtiliHub · Más de 500 herramientas online gratis";
const description = cleanDescription("Más de 500 herramientas online gratuitas para calcular, convertir, estudiar y resolver tareas cotidianas. Sin registro.");

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { name: "keywords", content: "herramientas online, calculadoras online, conversores, herramientas gratuitas, UtiliHub" }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: absoluteUrl("/") }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "canonical", href: absoluteUrl("/") }], scripts: [{ type: "application/ld+json", children: JSON.stringify(websiteSchema()) }] }),
  component: Home,
});

function Home() {
  const featuredCategories = ALL_CATEGORIES.slice(0, 9);
  return <main className="container-page pb-12 pt-3 sm:pt-5">
    <section aria-labelledby="home-title" className="py-3 sm:py-6">
      <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">UtiliHub</p><h1 id="home-title" className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">¿Qué necesitas resolver?</h1></div><span className="hidden text-xs font-semibold text-muted-foreground sm:inline">{ALL_TOOLS.length} herramientas</span></div>
      <div className="mt-4"><ToolSearch compactHome /></div>
      <nav className="mt-3 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Categorías principales">{featuredCategories.map((c) => <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="min-h-11 shrink-0 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary/40 hover:bg-accent">{c.name}</Link>)}</nav>
    </section>
    <FavoriteToolsSection />
    <RecentToolsSection />
    <section className="mt-10 border-t border-border/70 pt-6" aria-labelledby="explorar-categorias">
      <div className="flex items-center justify-between gap-3"><div><h2 id="explorar-categorias" className="text-lg font-bold">Explorar categorías</h2><p className="mt-1 text-sm text-muted-foreground">Acceso rápido a todo el catálogo.</p></div><Link to="/herramientas" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent">Ver todas <ArrowRight className="size-4" /></Link></div>
      <div className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">{ALL_CATEGORIES.map((c) => <Link key={c.slug} to="/categoria/$slug" params={{ slug: c.slug }} className="flex min-h-12 items-center justify-between border-b border-border/60 px-2 py-2 text-sm hover:bg-accent"><span className="font-semibold">{c.name}</span><span className="text-xs text-muted-foreground">{allToolsByCategory(c.slug).length}</span></Link>)}</div>
    </section>
    <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Sin registro</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Gratis</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> En tu navegador</span></div>
  </main>;
}
