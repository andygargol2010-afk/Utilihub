import { createFileRoute } from "@tanstack/react-router";
import { ParticlesPlayground } from "@/components/playgrounds/ParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Interactive Particles Playground | UtiliHub";
const description = cleanDescription(
  "Live particle system. Mouse attracts or repels, adjust gravity, friction, trails and color by velocity.",
);

export const Route = createFileRoute("/playgrounds/particles")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/particles") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/particles") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/particles") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/particulas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/particles") },
    ],
  }),
  component: ParticlesPageEn,
});

function ParticlesPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Interactive Particles</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Particles respond instantly to your mouse. Tune gravity, friction, trails and coloring — everything updates live.
        </p>
      </header>
      <ParticlesPlayground locale="en" />

      <PlaygroundNextStep currentId="particles" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
