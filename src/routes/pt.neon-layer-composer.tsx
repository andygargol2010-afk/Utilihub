import { createFileRoute } from "@tanstack/react-router";
import { NeonLayerComposer } from "@/components/playgrounds/NeonLayerComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Compositor de Camadas Neon | UtiliHub";
const description = cleanDescription(
  "Canvas de desenho neon multicamada à mão livre. Bloom ajustável, simetria radial/espelho/caleidoscópio, emissores de partículas ao longo dos traços que desvanecem com gravidade e vento. Paletas neon/aurora/pôr do sol. Título sobreposto no PNG. Link profundo. PT.",
);

export const Route = createFileRoute("/pt/neon-layer-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: absoluteUrl("/pt/neon-layer-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/pt/neon-layer-composer") },
      { rel: "alternate", hrefLang: "pt", href: absoluteUrl("/pt/neon-layer-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/neon-layer-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/neon-layer-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/neon-layer-composer") },
    ],
  }),
  component: NeonLayerPagePt,
});

function NeonLayerPagePt() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/pt/neon-layer-composer");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500">Estúdio · Composição</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Camadas Neon</h1>
          </div>
          <ExperienceShareButton
            title="Compositor de Camadas Neon"
            url={shareUrl}
            locale="pt"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Desenhe neon multicamada à mão livre com <strong className="font-semibold text-foreground">modos de simetria</strong>, bloom e partículas que se emitem ao longo dos traços e desvanecem sob gravidade e vento. Título sobreposto no PNG. Distinto das trilhas de prisma pelo neon em camadas + emissão caleidoscópica.
        </p>
      </header>
      <NeonLayerComposer locale="pt" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
