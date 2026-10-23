import { createFileRoute } from "@tanstack/react-router";
import { NeonLayerComposer } from "@/components/playgrounds/NeonLayerComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Compositor de Capas Neón | UtiliHub";
const description = cleanDescription(
  "Lienzo de dibujo neón multicapa a mano alzada. Bloom ajustable, modos de simetría radial/espejo/caleidoscopio, emisores de partículas adheridos al trazo que se desvanecen con gravedad y viento. Paletas neón/aurora/atardecer. Título superpuesto en PNG. Deep-link por URL.",
);

export const Route = createFileRoute("/es/neon-layer-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/neon-layer-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/neon-layer-composer") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/neon-layer-composer") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/neon-layer-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/neon-layer-composer") },
    ],
  }),
  component: CompositorCapasNeonPage,
});

function CompositorCapasNeonPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500">Studio · Composición</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Capas Neón</h1>
        <p className="mt-3 text-muted-foreground">
          Dibujá neón multicapa a mano alzada con <strong className="font-semibold text-foreground">modos de simetría</strong>, bloom y partículas que se emiten a lo largo de tus trazos y se desvanecen con gravedad y viento. Título superpuesto en el PNG. Distinto de las estelas prisma por capas neón + emisión caleidoscópica.
        </p>
      </header>
      <NeonLayerComposer locale="es" />
      <PlaygroundNextStep currentId="neon-layer-composer" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
