import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { DeferredFinancialUi } from "@/components/DeferredFinancialUi";
import { DeferredFinanceJourney } from "@/components/DeferredFinanceJourney";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredFinanceSeo } from "@/components/DeferredFinanceSeo";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";
import { financeSeo } from "@/lib/finance-seo-content";
import { toolByEnglishSlug, englishToolPath } from "@/lib/route-slugs";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, webApplicationSchema } from "@/lib/seo";
import { DeferredAdsterraBanner } from "@/components/DeferredAdsterraBanner";

export const Route = createFileRoute("/finance/$slug")({
  loader: ({ params }) => {
    const tool = toolByEnglishSlug(FINANCIAL_TOOLS, params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Financial calculator not found | UtiliHub" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { tool } = loaderData;
    const seo = financeSeo(tool.slug);
    const title = seo?.metaTitle ?? `${tool.name} calculator | UtiliHub`;
    const description = cleanDescription(seo?.metaDescription ?? tool.description);
    const url = absoluteUrl(englishToolPath(tool));
    const esUrl = absoluteUrl(`/es/finanzas/${tool.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: tool.keywords.join(", ") },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "UtiliHub" },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
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
            "@graph": [
              webApplicationSchema({ ...tool, description }),
              breadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Finance", path: "/finance" },
                { name: tool.name },
              ]),
              {
                "@type": "FAQPage",
                mainEntity: (seo?.faq ?? []).map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
              },
            ].filter((node) => node["@type"] !== "FAQPage" || (seo?.faq?.length ?? 0) > 0),
          }),
        },
      ],
    };
  },
  component: FinancialPage,
});

function FinancialPage() {
  const { tool } = Route.useLoaderData();
  const seo = financeSeo(tool.slug);

  const intro = seo?.intro ?? tool.description;

  return (
    <main className="container-page py-10 sm:py-14">
      <Link
        to="/finance"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <span aria-hidden="true">←</span> All financial calculators
      </Link>
      <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Financial calculator</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{tool.name}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{intro}</p>
        </div>
        <DeferredFavoriteButton slug={tool.slug} name={tool.name} />
      </div>

      <section data-tool-surface className="surface-card mt-8 p-5 sm:p-7" aria-label={tool.name}>
        <DeferredFinancialUi slug={tool.slug} locale="en" />
        <DeferredShareAndExport title={tool.name} />
      </section>

      <DeferredAdsterraBanner />

      <DeferredFinanceJourney tool={tool} />

      <DeferredFinanceSeo tool={tool} locale="en" />
    </main>
  );
}
