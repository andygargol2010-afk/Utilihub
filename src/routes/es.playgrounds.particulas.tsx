import { createFileRoute } from "@tanstack/react-router";
import { ParticlesPlayground } from "@/components/playgrounds/ParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Playground de partículas interactivas | UtiliHub";
const description = cleanDescription(
  "Sistema de partículas en vivo. El mouse atrae o repele, ajustá gravedad, fricción, estelas y color por velocidad.",
);

export const Route = createFileRoute("/es/playgrounds/particulas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/particulas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/particulas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/particulas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/particles") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/particles") },
    ],
  }),
  component: ParticulasPageEs,
});

function ParticulasPageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Partículas interactivas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Las partículas responden al instante al mouse. Ajustá gravedad, fricción, estelas y color — todo se actualiza en vivo.
        </p>
      </header>
      <ParticlesPlayground locale="es" />

      <PlaygroundNextStep currentId="particles" locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
