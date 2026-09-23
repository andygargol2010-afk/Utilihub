import { createFileRoute, Link } from "@tanstack/react-router";
import { SIMULATORS, simSummary, simTagLabel } from "@/lib/simulators/catalog";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Free graphic simulators | UtiliHub";
const description = cleanDescription(
  "Interactive physics and chemistry simulators in your browser. Molecular motion and states of matter — no signup.",
);

export const Route = createFileRoute("/simulators/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/simulators") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/simulators") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/simulators") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/simuladores") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/simulators") },
    ],
  }),
  component: SimulatorsHubEn,
});

function SimulatorsHubEn() {
  return (
    <div className="sim-skin min-h-[70vh] bg-gradient-to-b from-sky-50/80 via-background to-background">
      <div className="container-page py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Physics · Chemistry</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Simulators</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Interactive graphic simulations that run in your browser. Explore systems, change parameters, and see results live.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIMULATORS.map((sim) => (
            <Link
              key={sim.slug}
              to="/simulators/$slug"
              params={{ slug: sim.slug }}
              className="group flex flex-col rounded-3xl border border-sky-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden>
                {sim.emoji}
              </span>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-sky-700/80">
                {simTagLabel(sim.tag, "en")}
              </span>
              <span className="mt-1 text-lg font-bold text-slate-900 group-hover:text-sky-800">{sim.nameEn}</span>
              <span className="mt-2 flex-1 text-sm text-slate-600">{simSummary(sim, "en")}</span>
              <span className="mt-4 text-sm font-bold text-sky-700">Open →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
