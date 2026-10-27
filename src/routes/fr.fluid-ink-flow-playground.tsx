import { createFileRoute, Link } from "@tanstack/react-router";
import { FluidInkFlowPlayground } from "@/components/playgrounds/FluidInkFlowPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Terrain de jeu Fluid Ink Flow | UtiliHub";
const description = cleanDescription(
  "Dessinez des traits à main levée qui deviennent de l'encre visqueuse multicolore qui coule. Ajustez la viscosité, la densité, la gravité et la tension superficielle. Mélange en direct, pause, aléatoire, PNG avec marque.",
);

export const Route = createFileRoute("/fr/fluid-ink-flow-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: absoluteUrl("/fr/fluid-ink-flow-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/fr/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "fr", href: absoluteUrl("/fr/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-ink-flow-playground") },
    ],
  }),
  component: FluidInkFlowPageFr,
});

function FluidInkFlowPageFr() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Terrain de jeu · Partageable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Terrain de jeu Fluid Ink Flow</h1>
        <p className="mt-3 text-muted-foreground">
          Dessinez des traits à main levée qui deviennent de l'<strong className="font-semibold text-foreground">encre visqueuse multicolore qui coule</strong> avec viscosité ajustable, mélange de couleurs sur les chevauchements, densité de particules, gravité et tension superficielle.
          Pausez, randomisez ou effacez — puis partagez un PNG avec marque.
        </p>
      </header>
      <FluidInkFlowPlayground locale="fr" />

      <div className="mt-8">
        <Link to="/fr" className="text-sm font-semibold text-primary hover:underline">
          ← Retour à l'accueil en français
        </Link>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
