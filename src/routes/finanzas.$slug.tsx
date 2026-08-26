import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FINANCIAL_UI } from "@/components/financial/registry";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { financialToolBySlug } from "@/lib/financial-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME, webApplicationSchema } from "@/lib/seo";

export const Route = createFileRoute("/finanzas/$slug")({
  loader: ({ params }) => { const tool = financialToolBySlug(params.slug); if (!tool) throw notFound(); return { tool }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Calculadora financiera no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { tool } = loaderData;
    const title = `${tool.name} | UtiliHub`;
    const description = cleanDescription(tool.description || tool.summary);
    const url = absoluteUrl(`/finanzas/${tool.slug}`);
    const schemaTool = { name: tool.name, description, slug: tool.slug };
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
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage() },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [webApplicationSchema(schemaTool), breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Finanzas", path: "/finanzas" }, { name: tool.name }])] }) }],
    };
  },
  component: FinancialPage,
});

function FinancialPage() {
  const { tool } = Route.useLoaderData();
  const ui = FINANCIAL_UI[tool.slug];
  if (!ui) throw new Error(`Missing financial UI for catalog tool: ${tool.slug}`);
  return <main className="container-page py-10 sm:py-14"><Link to="/finanzas" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Todas las calculadoras financieras</Link><div className="mt-7 flex flex-wrap items-start justify-between gap-4"><div className="max-w-3xl"><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{tool.name}</h1><p className="mt-3 text-base leading-7 text-muted-foreground">{tool.description}</p></div><FavoriteButton slug={tool.slug} name={tool.name} /></div><section data-tool-surface className="surface-card mt-8 p-5 sm:p-7" aria-label={tool.name}>{ui()}<ShareAndExportActions title={tool.name} /></section><p className="mt-8 max-w-3xl text-xs leading-5 text-muted-foreground">Los resultados son estimaciones matemáticas. Verifica las condiciones reales de cualquier producto financiero antes de tomar decisiones.</p></main>;
}
