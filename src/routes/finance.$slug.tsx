import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { FINANCIAL_UI } from "@/components/financial/registry";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { ToolCard } from "@/components/ToolCard";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";
import { financeSeo } from "@/lib/finance-seo-content";
import { toolByEnglishSlug, englishToolPath, englishToolSlug } from "@/lib/route-slugs";
import { journeyLabel, journeyTools } from "@/lib/discovery";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, webApplicationSchema } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { ToolGamesBreak } from "@/components/ToolGamesBreak";

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
  const ui = FINANCIAL_UI[tool.slug];
  const seo = financeSeo(tool.slug);
  const journey = journeyTools({ slug: tool.slug, category: "finanzas" });
  const next = journey[0];
  if (!ui) throw new Error(`Missing financial UI for catalog tool: ${tool.slug}`);

  const intro = seo?.intro ?? tool.description;
  const aboutParas = seo?.about ?? [
    `${tool.description} This tool runs in the browser and provides a mathematical estimate from the values you enter.`,
  ];
  const steps = seo?.steps ?? [
    "Enter the values for the scenario you want to analyze.",
    "Run the calculation and review each result.",
    "Compare scenarios and verify real conditions before deciding.",
  ];
  const faq = seo?.faq ?? [];

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
        <FavoriteButton slug={tool.slug} name={tool.name} />
      </div>

      <section data-tool-surface className="surface-card mt-8 p-5 sm:p-7" aria-label={tool.name}>
        {ui()}
        <ShareAndExportActions title={tool.name} />
      </section>

      <AdsterraBanner />
      <ToolGamesBreak locale="en" />

      {next && (
        <section className="mt-6 rounded-2xl border border-primary/20 bg-accent/50 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Recommended next step</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black">{journeyLabel({ slug: tool.slug, category: "finanzas" })}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue with {next.name} to compare or complete the analysis.
              </p>
            </div>
            <Link
              to={englishToolPath(next) as "/finance/$slug"}
              params={{ slug: englishToolSlug(next) }}
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Open next
            </Link>
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="financial-journey">
        <div className="mb-2">
          <h2 id="financial-journey" className="text-xl font-black">
            Continue your analysis
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Related calculators to explore more financial scenarios.</p>
        </div>
        <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
          {journey.map((item) => (
            <ToolCard key={item.slug} tool={item} />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-2" aria-labelledby="financial-guide">
        <div>
          <h2 id="financial-guide" className="text-xl font-black">
            About this calculator
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            {aboutParas.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black">How to use it</h2>
          <ol className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {faq.length > 0 && (
        <section className="mt-10 border-t border-border/70 pt-8" aria-labelledby="financial-faq">
          <h2 id="financial-faq" className="text-xl font-black">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-border/70 bg-card p-4">
                <dt className="text-sm font-bold">{item.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <p className="mt-8 max-w-3xl text-xs leading-5 text-muted-foreground">
        Results are mathematical estimates. Verify the real conditions of any financial product before making decisions.
      </p>
    </main>
  );
}
