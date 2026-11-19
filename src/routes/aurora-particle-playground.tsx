import { createFileRoute } from "@tanstack/react-router";
import { AuroraParticlePlayground } from "@/components/playgrounds/AuroraParticlePlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Aurora Particle Playground | UtiliHub";
const description = cleanDescription(
  "Open canvas playground: place and drag magnetic attractors. Particles form glowing aurora-like flowing ribbons with persistent trails. Controls for density, speed, hue shift and turbulence. Shareable link and PNG.",
);

export const Route = createFileRoute("/aurora-particle-playground")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/aurora-particle-playground") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora-particle-playground") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora-particle-playground") },
    ],
  }),
  component: AuroraParticlePage,
});

function AuroraParticlePage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/aurora-particle-playground");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Playground · Shareable</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Aurora Particle Playground</h1>
          </div>
          <ExperienceShareButton
            title="Aurora Particle Playground"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Place and drag magnetic attractors on the open canvas. Particles form <strong className="font-semibold text-foreground">glowing aurora-like flowing ribbons</strong> with persistent trails that respond in real time.
          Tune density, flow speed, hue shift and turbulence — then share the link or download a PNG.
        </p>
      </header>
      <AuroraParticlePlayground locale="en" />

      <PlaygroundNextStep currentId="aurora-particle-playground" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
