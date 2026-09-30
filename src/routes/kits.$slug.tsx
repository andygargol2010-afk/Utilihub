import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { kitBySlug, kitTools, kitEnglishPath, kitSpanishPath } from "@/lib/work-kits";
import { englishToolSlug } from "@/lib/route-slugs";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/kits/$slug")({
  loader: ({ params }) => {
    const kit = kitBySlug(params.slug);
    if (!kit) throw notFound();
    return { kit, tools: kitTools(kit) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Kit not found | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    }
    const { kit } = loaderData;
    const title = `${kit.name} | UtiliHub`;
    const description = cleanDescription(kit.description);
    const url = absoluteUrl(kitEnglishPath(kit));
    const esUrl = absoluteUrl(kitSpanishPath(kit));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "es", href: esUrl },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: title,
            description,
            url,
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
            breadcrumb: breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Work kits", path: "/kits" },
              { name: kit.name },
            ]),
          }),
        },
      ],
    };
  },
  component: KitPage,
});

function KitPage() {
  const { kit, tools } = Route.useLoaderData();
  return (
    <main className="container-page py-6 sm:py-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Work kits", to: "/kits" }, { label: kit.name }]} />
      <header className="mt-5 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{kit.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{kit.name}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{kit.description}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 className="size-4 text-primary" /> {kit.outcome}
        </p>
      </header>
      <section className="mt-8" aria-labelledby="kit-steps">
        <h2 id="kit-steps" className="text-base font-bold">
          Kit steps
        </h2>
        <div className="mt-3 space-y-3">
          {tools.map((tool, index) => (
            <div key={tool.slug} className="flex gap-3 rounded-xl border border-border/70 bg-card p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-primary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <ToolCard tool={tool} />
                <Link
                  to={tool.category === "finanzas" ? "/finance/$slug" : "/tools/$slug"}
                  params={{ slug: englishToolSlug(tool) }}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary"
                >
                  Open tool <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Link to="/kits" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          All work kits <ArrowRight className="size-4" />
        </Link>
      </section>
    </main>
  );
}
