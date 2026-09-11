import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, GraduationCap, FileText, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { WORK_KITS, kitTools } from "@/lib/work-kits";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Goal-based work kits | UtiliHub";
const description = cleanDescription("Free online tool kits for freelancers, SEO and content, documents, and students. Chain multiple utilities with no signup.");
const icons = [BriefcaseBusiness, Search, FileText, GraduationCap];

export const Route = createFileRoute("/kits")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/kits") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/kits") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: title, description, url: absoluteUrl("/kits") }, breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Work kits" }])] }) }],
  }),
  component: KitsPage,
});

function KitsPage() {
  const pathname = useLocation({ select: (location) => location.pathname });
  if (pathname !== "/kits") return <Outlet />;
  return <main className="container-page py-6 sm:py-8">
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Work kits" }]} />
    <header className="hero-gradient mt-4 rounded-2xl border border-border/70 p-6 sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Solve by goal</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Kits to chain tools without wasting time.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Start from your situation and follow a path of related tools. Everything runs in the browser, with no signup and local processing when the tool allows it.</p>
    </header>
    <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Work kits">
      {WORK_KITS.map((kit, index) => {
        const Icon = icons[index % icons.length];
        const tools = kitTools(kit);
        return <Link key={kit.slug} to="/kits/$slug" params={{ slug: kit.slug }} className="surface-card group p-5 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
          <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" /></span><span className="rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-muted-foreground">{tools.length} steps</span></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-primary">{kit.eyebrow}</p>
          <h2 className="mt-1 text-xl font-black group-hover:text-primary">{kit.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{kit.description}</p>
          <p className="mt-4 text-sm font-semibold">{kit.outcome}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Open kit <ArrowRight className="size-4" /></span>
        </Link>;
      })}
    </section>
    <section className="mt-10 rounded-2xl border border-border/70 bg-surface/55 p-5 sm:p-6"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Privacy first:</strong> kits only organize links. They do not create an account or send your data to a server.</p></div></section>
  </main>;
}
