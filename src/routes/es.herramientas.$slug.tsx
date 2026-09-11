import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TOOL_UI_ES } from "@/components/tools/registry";
import { GENERAL_TOOL_UI_ES } from "@/components/general/registry";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { allToolBySlug, ALL_CATEGORIES } from "@/lib/all-tools";
import { englishToolPath } from "@/lib/route-slugs";
import { absoluteUrl, ogImage } from "@/lib/seo";
import { spanishCategoryName, spanishToolName } from "@/lib/i18n/es";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/es/herramientas/$slug")({
  loader: ({ params }) => { const tool = allToolBySlug(params.slug); if (!tool || tool.category === "finanzas") throw notFound(); return { tool }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Herramienta no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { tool } = loaderData;
    const url = absoluteUrl(`/es/herramientas/${tool.slug}`);
    const name = spanishToolName(tool);
    const category = spanishCategoryName(tool.category);
    const description = `Herramienta gratuita de ${category.toLowerCase()} para usar directamente en el navegador.`;
    const englishUrl = absoluteUrl(englishToolPath(tool));
    return { meta: [{ title: `${name} | UtiliHub` }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: name }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:locale", content: "es_ES" }, { property: "og:url", content: url }, { property: "og:image", content: ogImage() }], links: [{ rel: "canonical", href: url }, { rel: "alternate", hrefLang: "es", href: url }, { rel: "alternate", hrefLang: "en", href: englishUrl }, { rel: "alternate", hrefLang: "x-default", href: englishUrl }] };
  },
  component: SpanishToolPage,
});

function SpanishToolPage() {
  const { tool } = Route.useLoaderData();
  const { addRecent } = useRecentTools();
  const category = ALL_CATEGORIES.find((item) => item.slug === tool.category);
  const ui = TOOL_UI_ES[tool.slug] ?? GENERAL_TOOL_UI_ES[tool.slug];
  useEffect(() => { addRecent(tool.slug); }, [addRecent, tool.slug]);
  return <main className="container-page py-6 sm:py-8">
    <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Herramientas", to: "/es/herramientas" }, { label: category ? spanishCategoryName(category.slug) : "Categoría" }, { label: spanishToolName(tool) }]} />
    <div className="mt-3 flex items-center justify-between gap-3"><div className="min-w-0"><h1 className="text-2xl font-bold sm:text-3xl">{spanishToolName(tool)}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Herramienta de {spanishCategoryName(tool.category).toLowerCase()}.</p></div><FavoriteButton slug={tool.slug} name={spanishToolName(tool)} /></div>
    <section data-tool-surface aria-label={`Herramienta: ${spanishToolName(tool)}`} className="surface-card mt-5 p-4 sm:p-5">{ui ? ui() : <p role="alert" className="text-muted-foreground">Herramienta no disponible.</p>}<div className="mt-4"><ShareAndExportActions title={spanishToolName(tool)} locale="es" /></div></section>
    <AdsterraBanner />
  </main>;
}
