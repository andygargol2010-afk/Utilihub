import { createFileRoute } from "@tanstack/react-router";
import { PrismTrailComposer } from "@/components/playgrounds/PrismTrailComposer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Compositor de Estela Prisma | UtiliHub";
const description = cleanDescription(
  "Estelas de prisma de luz multicapa a mano alzada. Dibujá trayectorias que se dividen en haces de refracción arcoíris con bloom en vivo, dispersión y velocidad ajustables. Estelas persistentes con resplandor de partículas. Exportá PNG compartible.",
);

export const Route = createFileRoute("/es/studio/compositor-estela-prisma")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/studio/compositor-estela-prisma") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/studio/compositor-estela-prisma") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/studio/compositor-estela-prisma") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/studio/prism-trail-composer") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/studio/prism-trail-composer") },
    ],
  }),
  component: CompositorEstelaPrismaPage,
});

function CompositorEstelaPrismaPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Estudio · Composición</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Compositor de Estela Prisma</h1>
        <p className="mt-3 text-muted-foreground">
          Dibujá trayectorias a mano alzada que se dividen en <strong className="font-semibold text-foreground">haces de refracción arcoíris</strong> con bloom en vivo, dispersión ajustable y velocidad de partículas. Las estelas persisten con resplandor colorido. Exportá un PNG compartible de tu composición de luz.
        </p>
      </header>
      <PrismTrailComposer locale="es" />

      <PlaygroundNextStep currentId="prism-trail-composer" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
