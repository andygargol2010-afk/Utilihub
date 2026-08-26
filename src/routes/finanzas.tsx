import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, ChartNoAxesCombined, PiggyBank, ReceiptText, WalletCards } from "lucide-react";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ICONS = [ChartNoAxesCombined, ReceiptText, WalletCards, PiggyBank, Calculator];
const title = "Calculadoras financieras online gratis | UtiliHub";
const description = "Calculadoras financieras gratuitas para inversión, préstamos, ahorro, inflación, carteras, jubilación, bonos y renta fija, directamente en tu navegador.";

export const Route = createFileRoute("/finanzas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: cleanDescription(description) },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: cleanDescription(description) },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/finanzas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: cleanDescription(description) },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/finanzas") }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", name: title, description, url: absoluteUrl("/finanzas"), numberOfItems: FINANCIAL_TOOLS.length, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") } },
          breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Finanzas" }]),
        ],
      }),
    }],
  }),
  component: FinancialHub,
});

function FinancialHub() {
  return <main className="container-page py-12 sm:py-16"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Finanzas</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Herramientas financieras</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Calculadoras para inversión, ahorro, préstamos, inflación, carteras, jubilación, bonos y valoración. Las fórmulas se ejecutan en tu navegador.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{FINANCIAL_TOOLS.map((tool, i) => { const Icon = ICONS[i % ICONS.length]; return <Link key={tool.slug} to="/finanzas/$slug" params={{ slug: tool.slug }} className="surface-card group p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"><span className="grid size-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" /></span><h2 className="mt-5 text-xl font-bold group-hover:text-primary">{tool.name}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.summary}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">Calcular <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>; })}</div><p className="mt-10 max-w-2xl text-xs leading-5 text-muted-foreground">Los resultados son estimaciones matemáticas. No sustituyen asesoramiento financiero ni incorporan automáticamente impuestos, comisiones o cambios futuros del mercado.</p></main>;
}
