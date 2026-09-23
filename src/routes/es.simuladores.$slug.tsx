import { createFileRoute, notFound } from "@tanstack/react-router";
import { SimShell } from "@/components/simulators/SimShell";
import { SimPlayer } from "@/components/simulators/registry";
import { simBySlug, simName, simSummary } from "@/lib/simulators/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/es/simuladores/$slug")({
  loader: ({ params }) => {
    const sim = simBySlug(params.slug, "es");
    if (!sim) throw notFound();
    return { sim };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Simulador no encontrado | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { sim } = loaderData;
    const title = `${simName(sim, "es")} — simulador interactivo | UtiliHub`;
    const description = cleanDescription(simSummary(sim, "es"));
    const url = absoluteUrl(`/es/simuladores/${sim.slugEs}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/simulators/${sim.slug}`) },
        { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(`/simulators/${sim.slug}`) },
      ],
    };
  },
  component: SimPageEs,
});

function SimPageEs() {
  const { sim } = Route.useLoaderData();
  return (
    <>
      <SimShell sim={sim} locale="es">
        <SimPlayer sim={sim} locale="es" />
      </SimShell>
      <div className="container-page pb-10">
        <AdsterraBanner label="Publicidad" />
      </div>
    </>
  );
}
