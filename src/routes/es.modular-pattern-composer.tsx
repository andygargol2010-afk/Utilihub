import { createFileRoute } from "@tanstack/react-router";
import { ModularPatternComposer } from "@/components/playgrounds/ModularPatternComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Compositor de Patrones Modulares | UtiliHub";
const description = cleanDescription(
  "Colocá baldosas modulares en una grilla con animaciones procedurales en vivo (flujo, pulso, morph). Multicapa, modos de simetría, biblioteca de baldosas, paletas, controles de reproducción. Compartir PNG con título y conteo. Deep-link por URL. Distinto del neón a mano alzada por sistemas repetibles.",
);

export const Route = createFileRoute("/es/modular-pattern-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/modular-pattern-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/modular-pattern-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/modular-pattern-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/modular-pattern-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/modular-pattern-composer") },
    ],
  }),
  component: CompositorPatronesModularesPage,
});

function CompositorPatronesModularesPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/modular-pattern-composer");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500">Studio · Composición</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Patrones Modulares</h1>
          </div>
          <ExperienceShareButton
            title="Compositor de Patrones Modulares"
            url={shareUrl}
            locale="es"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Colocá baldosas modulares en una grilla con <strong className="font-semibold text-foreground">animaciones procedurales en vivo</strong> (flujo, pulso, morph). La simetría multiplica las colocaciones. Distinto del compositor de capas neón por sistemas de baldosas repetibles + reproducción de animación. PNG con título y conteo de baldosas.
        </p>
      </header>
      <ModularPatternComposer locale="es" />
      <PlaygroundNextStep currentId="modular-pattern-composer" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
