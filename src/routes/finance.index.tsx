import { createFileRoute } from "@tanstack/react-router";
import { FinancialToolCard } from "@/components/FinancialToolCard";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";
import { absoluteUrl, ogImage } from "@/lib/seo";

export const Route = createFileRoute("/finance/")({
  head: () => ({
    meta: [
      { title: "Online financial calculators | UtiliHub" },
      {
        name: "description",
        content:
          "Free financial calculators for investing, loans, savings, inflation, portfolios, retirement, and fixed income.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Online financial calculators | UtiliHub" },
      { property: "og:description", content: "Free financial calculators that run in your browser." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/finance") },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/finance") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/finance") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/finanzas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/finance") },
    ],
  }),
  component: FinancialHub,
});

function FinancialHub() {
  return (
    <main className="container-page py-6 sm:py-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Finance</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Financial tools</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Free financial calculators for investing, savings, loans, inflation, and portfolios.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">{FINANCIAL_TOOLS.length} tools</span>
      </div>
      <div className="mt-5 divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
        {FINANCIAL_TOOLS.map((tool) => (
          <FinancialToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </main>
  );
}
