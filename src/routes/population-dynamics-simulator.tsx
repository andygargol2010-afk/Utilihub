import { createFileRoute } from "@tanstack/react-router";
import { PopulationDynamicsSim } from "@/components/playgrounds/PopulationDynamicsSim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Population Dynamics Simulator | UtiliHub";
const description = cleanDescription(
  "Interactive population dynamics simulator: set initial population, birth rate, death rate, and carrying capacity. Watch discrete generations of logistic growth on a live SVG chart. Compare two scenarios, see phase (growth/decline/stable), peak, and generations to capacity. EN+ES. Mobile-first.",
);

export const Route = createFileRoute("/population-dynamics-simulator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/population-dynamics-simulator") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/population-dynamics-simulator") },
      ...hreflangLinks("/population-dynamics-simulator", "/es/simulador-dinamica-poblacional"),
    ],
  }),
  component: PopulationPage,
});

function PopulationPage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/population-dynamics-simulator");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Simulator · Interactive</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Population Dynamics Simulator</h1>
          </div>
          <ExperienceShareButton
            title="Population Dynamics Simulator"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Set initial population, birth rate, death rate, and carrying capacity. Run discrete generations to see live logistic growth on an SVG chart. Compare two scenarios side-by-side. Phase indicators, peak population, and generations to capacity. Share branded PNG or deep-link URL.
        </p>
      </header>
      <PopulationDynamicsSim locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
