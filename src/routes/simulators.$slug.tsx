import { createFileRoute, notFound } from "@tanstack/react-router";
import { SimShell } from "@/components/simulators/SimShell";
import { SimPlayer } from "@/components/simulators/registry";
import { simBySlug, simName, simSummary } from "@/lib/simulators/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/simulators/$slug")({
  loader: ({ params }) => {
    const sim = simBySlug(params.slug, "en");
    if (!sim) throw notFound();
    return { sim };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Simulator not found | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { sim } = loaderData;
    const title = `${simName(sim, "en")} — interactive simulator | UtiliHub`;
    const description = cleanDescription(simSummary(sim, "en"));
    const url = absoluteUrl(`/simulators/${sim.slug}`);
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
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "es", href: absoluteUrl(`/es/simuladores/${sim.slugEs}`) },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
    };
  },
  component: SimPageEn,
});

function SimPageEn() {
  const { sim } = Route.useLoaderData();
  return (
    <>
      <SimShell sim={sim} locale="en">
        <SimPlayer sim={sim} locale="en" />
      </SimShell>
      <div className="container-page pb-10">
        <AdsterraBanner />
      </div>
    </>
  );
}
