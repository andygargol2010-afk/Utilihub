import { createFileRoute } from "@tanstack/react-router";
import { SirEpidemicSim } from "@/components/simulators/SirEpidemicSim";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "SIR Epidemic Simulator | UtiliHub";
const description = cleanDescription(
  "Interactive SIR compartmental model. Adjust transmission (β) and recovery (γ), toggle lockdown or vaccination campaign, watch S/I/R curves update live. Share scenarios via URL.",
);

export const Route = createFileRoute("/sir-epidemic-simulator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/sir-epidemic-simulator") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/sir-epidemic-simulator") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/sir-epidemic-simulator") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/simulador-epidemia-sir") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/sir-epidemic-simulator") },
    ],
  }),
  component: SirEpidemicPage,
});

function SirEpidemicPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600">Simulator · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">SIR Epidemic Simulator</h1>
        <p className="mt-3 text-sm text-white/70 sm:text-base">
          Set transmission rate <strong>β</strong> and recovery rate <strong>γ</strong>. Toggle a <strong>lockdown</strong> (lowers β) or <strong>vaccination campaign</strong> (moves susceptibles to recovered). Watch the S/I/R curves respond live. Share any scenario with the URL.
        </p>
      </header>
      <SirEpidemicSim locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
