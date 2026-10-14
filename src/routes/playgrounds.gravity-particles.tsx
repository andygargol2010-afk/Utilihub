import { createFileRoute } from "@tanstack/react-router";
import { GravityParticlesPlayground } from "@/components/playgrounds/GravityParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Gravity Particles Playground | UtiliHub";
const description = cleanDescription(
  "Click to place attractors and watch particles orbit in real time. Tune gravity strength and particle count. Shareable, mobile-friendly.",
);

export const Route = createFileRoute("/playgrounds/gravity-particles")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/gravity-particles") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/gravity-particles") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/gravity-particles") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/particulas-gravedad") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/gravity-particles") },
    ],
  }),
  component: GravityParticlesPageEn,
});

function GravityParticlesPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Gravity Particles Playground</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Click or tap to place attractors. Particles orbit and respond instantly. Tune gravity and count — everything is live and shareable.
        </p>
      </header>
      <GravityParticlesPlayground locale="en" />

      <PlaygroundNextStep currentId="gravity-particles" locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
