import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { KitDeskTrail } from "@/components/kits/KitDeskTrail";
import { WORK_KITS } from "@/lib/work-kits";
import { kitTools } from "@/lib/work-kits-tools";
import { absoluteUrl, breadcrumbSchema, ogImage } from "@/lib/seo";
import { KIT_ES } from "./-es.kits.part1";
import { title, description, icons } from "./-es.kits.part2";

export const Route = createFileRoute("/es/kits")({
  // Layout route: only the hub itself emits canonical/hreflang, so /es/kits/<slug> keeps its own self-canonical.
  head: ({ matches }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kits") },
      { property: "og:image", content: ogImage() },
    ],
    links:
      matches[matches.length - 1]?.routeId === "/es/kits"
        ? [
            { rel: "canonical", href: absoluteUrl("/es/kits") },
            { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits") },
            { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits") },
          ]
        : [],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: title, description, url: absoluteUrl("/es/kits") }, breadcrumbSchema([{ name: "Inicio", path: "/es" }, { name: "Kits" }])] }) }],
  }),
  component: SpanishKitsPage,
});

function SpanishKitsPage() {
  const pathname = useLocation({ select: (location) => location.pathname });
  if (pathname !== "/es/kits") return <Outlet />;
  return (
    <main className="container-page py-6 sm:py-8">
      <Breadcrumbs locale="es" items={[{ label: "Inicio", to: "/es" }, { label: "Kits por objetivo" }]} />
      <header className="hero-gradient mt-4 rounded-2xl border border-border/70 p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Resolvé por objetivo</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Kits para encadenar herramientas sin perder tiempo.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Partí de tu situación y seguí un camino de herramientas relacionadas. Todo corre en el navegador, sin registro.
        </p>
      </header>
      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Kits de trabajo">
        {WORK_KITS.map((kit, index) => {
          const Icon = icons[index % icons.length];
          const tools = kitTools(kit);
          const es = KIT_ES[kit.slug] ?? { name: kit.name, eyebrow: kit.eyebrow, description: kit.description, outcome: kit.outcome };
          return (
            <Link key={kit.slug} to="/es/kits/$slug" params={{ slug: kit.slug }} className="surface-card group p-5 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" /></span>
                <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-muted-foreground">{tools.length} pasos</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-primary">{es.eyebrow}</p>
              <h2 className="mt-1 text-xl font-black group-hover:text-primary">{es.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{es.description}</p>
              <p className="mt-4 text-sm font-semibold">{es.outcome}</p>
              <KitDeskTrail kitSlug={kit.slug} stepCount={tools.length} locale="es" />
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Abrir kit <ArrowRight className="size-4" /></span>
            </Link>
          );
        })}
      </section>
      <section className="mt-10 rounded-2xl border border-border/70 bg-surface/55 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 text-primary" />
          <div>
            <h2 className="font-black">Sin cuenta, con privacidad local</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Las operaciones compatibles se ejecutan en tu navegador. Podés guardar favoritos de forma local.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
