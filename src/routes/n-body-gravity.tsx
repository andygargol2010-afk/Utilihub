import { createFileRoute } from "@tanstack/react-router";
import { NBodyGravitySim } from "@/components/playgrounds/NBodyGravitySim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "N-Body Gravity Simulator | UtiliHub";
const description = cleanDescription(
  "Interactive N-Body Gravity Simulator: add celestial bodies with mass, velocity, color. Watch live gravitational dynamics, particle trails, soft collisions, zoom/pan, time scale, presets. PNG share + URL deep-link. EN.",
);

export const Route = createFileRoute("/n-body-gravity")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/n-body-gravity") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/n-body-gravity") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/n-body-gravity") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/n-body-gravity") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/n-body-gravity") },
    ],
  }),
  component: NBodyPage,
});

function NBodyPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/n-body-gravity");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulator · Interactive</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">N-Body Gravity Simulator</h1>
          </div>
          <ExperienceShareButton
            title="N-Body Gravity Simulator"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Add celestial bodies with adjustable mass, initial velocity, color and size. Watch live gravitational dynamics unfold with particle trails, soft collision handling, zoom/pan camera, time scale controls, pause/reset, and presets (binary stars, miniature solar system, chaotic cluster). Snapshot PNG share + URL deep-link for initial conditions.
        </p>
      </header>
      <NBodyGravitySim locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
