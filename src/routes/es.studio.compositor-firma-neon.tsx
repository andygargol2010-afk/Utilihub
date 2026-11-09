import { createFileRoute } from "@tanstack/react-router";
import { NeonSignatureComposer } from "@/components/playgrounds/NeonSignatureComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Compositor de Firma Neón | UtiliHub";
const description = cleanDescription(
  "Dibujá firmas de neón a mano alzada en multicapa. Trayectorias persistentes con brillo fluido, intensidad ajustable y chispas opcionales. Estudio de composición visual táctil.",
);

export const Route = createFileRoute("/es/studio/compositor-firma-neon")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/studio/compositor-firma-neon") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/studio/compositor-firma-neon") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/studio/compositor-firma-neon") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/studio/neon-signature-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/studio/neon-signature-composer") },
    ],
  }),
  component: CompositorFirmaNeonPage,
});

function CompositorFirmaNeonPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600">Estudio · Composición</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Firma Neón</h1>
        <p className="mt-3 text-muted-foreground">
          Dibujá trazos a mano alzada en multicapa que se convierten en trayectorias de neón persistentes con brillo fluido, intensidad ajustable y chispas opcionales. Componé firmas de luz temporales con alto impacto visual.
        </p>
      </header>
      <NeonSignatureComposer locale="es" />

      <PlaygroundNextStep currentId="neon-signature-composer" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
