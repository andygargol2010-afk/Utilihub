import { createFileRoute } from "@tanstack/react-router";
import { AuroraParticlePlayground } from "@/components/playgrounds/AuroraParticlePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Playground de Partículas Aurora | UtiliHub";
const description = cleanDescription(
  "Playground de canvas abierto: colocá y arrastrá atractores magnéticos. Las partículas forman cintas de aurora brillantes y fluidas con estelas persistentes. Controles de densidad, velocidad, tono y turbulencia. Enlace compartible y PNG.",
);

export const Route = createFileRoute("/es/aurora-particle-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/aurora-particle-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora-particle-playground") },
    ],
  }),
  component: AuroraParticlePageEs,
});

function AuroraParticlePageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Playground de Partículas Aurora</h1>
        <p className="mt-3 text-muted-foreground">
          Colocá y arrastrá atractores magnéticos en el canvas abierto. Las partículas forman <strong className="font-semibold text-foreground">cintas de aurora brillantes y fluidas</strong> con estelas persistentes que responden en tiempo real.
          Ajustá densidad, velocidad de flujo, desplazamiento de tono y turbulencia — luego compartí el enlace o descargá un PNG.
        </p>
      </header>
      <AuroraParticlePlayground locale="es" />

      <PlaygroundNextStep currentId="aurora-particle-playground" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
