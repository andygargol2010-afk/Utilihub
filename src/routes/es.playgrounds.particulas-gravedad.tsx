import { createFileRoute } from "@tanstack/react-router";
import { GravityParticlesPlayground } from "@/components/playgrounds/GravityParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Partículas con gravedad | UtiliHub";
const description = cleanDescription(
  "Partículas que caen y se agrupan con gravedad. Ajustá la fuerza y mirá cómo se agrupan en vivo.",
);

export const Route = createFileRoute("/es/playgrounds/particulas-gravedad")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/gravity-particles") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/gravity-particles") },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Partículas con gravedad</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Las partículas caen y se agrupan bajo gravedad. Ajustá parámetros en vivo.
        </p>
      </header>
      <GravityParticlesPlayground locale="es" />

      <PlaygroundNextStep currentId="gravity-particles" locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
