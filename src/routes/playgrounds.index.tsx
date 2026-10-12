import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Playgrounds | UtiliHub";
const description = cleanDescription(
  "Interactive visual playgrounds in the browser. Experiment with particles, physics and live controls.",
);

export const Route = createFileRoute("/playgrounds/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds") },
    ],
  }),
  component: PlaygroundsHubEn,
});

function PlaygroundsHubEn() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Live · Visual · Interactive</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Playgrounds</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Small visual experiments. Change parameters and see the result immediately.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/playgrounds/particles"
          className="group flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ✨
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Particles</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Interactive Particles</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Mouse attracts or repels. Gravity, friction, trails, color by speed. Live canvas.
          </span>
          <span className="mt-5 text-sm font-bold text-sky-700">Open playground →</span>
        </Link>

        <Link
          to="/playgrounds/debt-snowball"
          className="group flex flex-col rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            📉
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Debt</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Snowball vs Avalanche</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Add debts and watch both payoff methods compete with live progress bars and timeline.
          </span>
          <span className="mt-5 text-sm font-bold text-emerald-700">Open playground →</span>
        </Link>

        <Link
          to="/playgrounds/floor-plan"
          className="group flex flex-col rounded-3xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            🏠
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Studio</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Floor Plan Studio</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Compose rooms and furniture. Drag, rotate, wall colors, live area and shareable URL.
          </span>
          <span className="mt-5 text-sm font-bold text-amber-700">Open studio →</span>
        </Link>

        <Link
          to="/playgrounds/constellation"
          className="group flex flex-col rounded-3xl border border-indigo-900/15 bg-gradient-to-br from-indigo-50 via-white to-violet-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ⭐
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Share</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Constellation Share Studio</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            Drag stars, connect lines, load myth presets. Full state in a shareable URL.
          </span>
          <span className="mt-5 text-sm font-bold text-indigo-700">Open studio →</span>
        </Link>
      </div>
    </div>
  );
}
