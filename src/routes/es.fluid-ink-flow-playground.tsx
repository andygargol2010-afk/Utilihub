import { createFileRoute } from "@tanstack/react-router";
import { FluidInkFlowPlayground } from "@/components/playgrounds/FluidInkFlowPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Playground Flujo de Tinta Fluida | UtiliHub";
const description = cleanDescription(
  "Dibujá trazos a mano alzada que se convierten en tinta viscosa multicolor que fluye. Ajustá viscosidad, densidad, gravedad y tensión superficial. Mezcla en vivo, pausa, aleatorio, PNG con marca.",
);

export const Route = createFileRoute("/es/fluid-ink-flow-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/fluid-ink-flow-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/fluid-ink-flow-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/fluid-ink-flow-playground") },
    ],
  }),
  component: FluidInkFlowPageEs,
});

function FluidInkFlowPageEs() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/es/fluid-ink-flow-playground");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Compartible</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Playground Flujo de Tinta Fluida</h1>
          </div>
          <ExperienceShareButton
            title="Playground Flujo de Tinta Fluida"
            url={shareUrl}
            locale="es"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Dibujá trazos a mano alzada que se convierten en <strong className="font-semibold text-foreground">tinta viscosa multicolor que fluye</strong> con viscosidad ajustable, mezcla de colores en solapamientos, densidad de partículas, gravedad y tensión superficial.
          Pausá, aleatorizá o limpiá — luego compartí un PNG con marca.
        </p>
      </header>
      <FluidInkFlowPlayground locale="es" />

      <PlaygroundNextStep currentId="fluid-ink-flow-playground" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
