import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Compass, Sparkles } from "lucide-react";
import { ToolSearch } from "@/components/ToolSearch";
import { FavoriteToolsSection } from "@/components/FavoriteToolsSection";
import { RecentToolsSection } from "@/components/RecentToolsSection";
import { ALL_CATEGORIES, ALL_TOOLS, allToolBySlug, allToolsByCategory } from "@/lib/all-tools";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, websiteSchema } from "@/lib/seo";
import { TOOL_WORKFLOWS } from "@/lib/workflows";

const title = "UtiliHub · Herramientas online gratis para resolverlo rápido";
const description = cleanDescription("Más de 500 herramientas online gratuitas para calcular, convertir, estudiar y resolver tareas cotidianas. Encuentra la herramienta que necesitas sin registro.");
const QUICK_TOOL_SLUGS = ["calculadora", "calculadora-de-porcentajes", "regla-de-tres", "calculadora-de-fechas", "contador-de-palabras", "generador-de-contrasenas", "conversor-de-temperatura", "conversor-de-unidades"];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { name: "keywords", content: "herramientas online, calculadoras online, conversores, herramientas gratuitas, UtiliHub" }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: absoluteUrl("/") }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "canonical", href: absoluteUrl("/") }], scripts: [{ type: "application/ld+json", children: JSON.stringify(websiteSchema()) }] }),
  component: Home,
});

function Home() {
  const featuredCategories = ALL_CATEGORIES.slice(0, 9);
  const quickTools = QUICK_TOOL_SLUGS.map((slug) => ALL_TOOLS.find((tool) => tool.slug === slug)).filter((tool): tool is (typeof ALL_TOOLS)[number] => Boolean(tool));
  const workflows = TOOL_WORKFLOWS.map((workflow) => ({ ...workflow, tools: workflow.steps.map(allToolBySlug).filter((tool): tool is (typeof ALL_TOOLS)[number] => Boolean(tool)) }));
  return <main className="pb-12">
    <section className="hero-gradient border-b border-border/70">
      <div className="container-page grid gap-8 py-10 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:py-20">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary"><Sparkles className="size-3.5" /> Utilidades sin complicaciones</div>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Resuelve lo que necesitas en segundos.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Calcula, convierte, estudia y organiza tareas cotidianas con herramientas gratuitas que funcionan directamente en tu navegador.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link to="/herramientas" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95">Explorar herramientas <ArrowRight className="size-4" /></Link><Link to="/finanzas" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary/40 hover:bg-accent">Ver calculadoras financieras</Link></div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Sin registro</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Gratis</span><span className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" /> Privacidad local</span></div>
        </div>
        <div className="surface-card bg-card/80 p-3 shadow-lift sm:p-4"><div className="rounded-xl border border-border/70 bg-background p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Acceso directo</p><h2 className="mt-1 text-xl font-black">¿Qué quieres resolver?</h2></div><span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">{ALL_TOOLS.length} herramientas</span></div><div className="mt-4"><ToolSearch compactHome /></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-3">{featuredCategories.slice(0, 6).map((category) => <Link key={category.slug} to="/categoria/$slug" params={{ slug: category.slug }} className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">{category.name}</Link>)}</div></div></div>
      </div>
    </section>
    <div className="container-page">
      <section className="py-10 sm:py-12" aria-labelledby="atajos-title"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Empieza aquí</p><h2 id="atajos-title" className="mt-1 text-2xl font-black sm:text-3xl">Accesos rápidos</h2><p className="mt-2 text-sm text-muted-foreground">Las herramientas más prácticas para empezar sin navegar por todo el catálogo.</p></div><Link to="/herramientas" className="hidden min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent sm:inline-flex">Ver catálogo <ArrowRight className="size-4" /></Link></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{quickTools.map((tool) => <Link key={tool.slug} to="/herramientas/$slug" params={{ slug: tool.slug }} className="group rounded-xl border border-border/70 bg-card p-4 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lift"><span className="text-xs font-bold uppercase tracking-wide text-primary">{tool.category}</span><h3 className="mt-2 font-bold group-hover:text-primary">{tool.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.summary}</p></Link>)}</div></section>
      <FavoriteToolsSection />
      <RecentToolsSection />
      <section className="mt-10 border-t border-border/70 py-10" aria-labelledby="flujos-title">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Resuelve por objetivo</p><h2 id="flujos-title" className="mt-1 text-2xl font-black sm:text-3xl">Flujos para empezar sin perderte</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Combina herramientas relacionadas y completa una tarea de principio a fin, siempre en tu navegador.</p></div>
          <Link to="/herramientas" className="hidden min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent sm:inline-flex">Ver catálogo <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {workflows.map((workflow) => <article key={workflow.slug} className="group rounded-2xl border border-border/70 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-lift">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{workflow.audience}</p>
            <h3 className="mt-2 text-lg font-black">{workflow.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{workflow.description}</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-3">
              {workflow.tools.map((tool, index) => <li key={`${workflow.slug}-${tool.slug}`}><Link to="/herramientas/$slug" params={{ slug: tool.slug }} className="flex min-h-12 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm font-semibold hover:border-primary/45 hover:bg-accent"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-black text-primary">{index + 1}</span><span className="line-clamp-2">{tool.name}</span></Link></li>)}
            </ol>
          </article>)}
        </div>
      </section>
      <section className="mt-10 border-t border-border/70 py-10" aria-labelledby="explorar-categorias"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Explora por objetivo</p><h2 id="explorar-categorias" className="mt-1 text-2xl font-black">Todas las categorías</h2><p className="mt-2 text-sm text-muted-foreground">Encuentra una colección de herramientas organizada por tarea.</p></div><Link to="/herramientas" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-bold text-primary hover:bg-accent">Ver todas <ArrowRight className="size-4" /></Link></div><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{ALL_CATEGORIES.map((category) => <Link key={category.slug} to="/categoria/$slug" params={{ slug: category.slug }} className="group flex min-h-16 items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/40 hover:bg-accent"><span><span className="block font-bold group-hover:text-primary">{category.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{category.description}</span></span><span className="ml-3 shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-muted-foreground">{allToolsByCategory(category.slug).length}</span></Link>)}</div></section>
      <section className="grid gap-4 rounded-2xl border border-border/70 bg-surface/55 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6" aria-labelledby="conoce-title"><div className="grid size-12 place-items-center rounded-xl bg-accent text-primary"><Compass className="size-6" /></div><div><h2 id="conoce-title" className="font-black">Una colección para tus tareas diarias</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">UtiliHub reúne calculadoras, conversores, herramientas de texto, estudio, ciencia y productividad en un solo lugar.</p></div><Link to="/herramientas" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">Abrir catálogo <ArrowRight className="size-4" /></Link></section>
    </div>
  </main>;
}
