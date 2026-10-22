import { lazy, Suspense, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DeferredHomeReviews } from "@/components/DeferredHomeReviews";
import { HomeCatalogSlot } from "@/components/home-catalog-slot";
import { AdBanner } from "@/components/AdBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, websiteSchema } from "@/lib/seo";

const loadHomeCatalog = () => import("@/components/home-catalog");
const HomeToolCount = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeToolCount })));
const HomeSearch = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeSearch })));
const HomeCatalogRest = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeCatalogRest })));

const title = "UtiliHub · Free online tools, 3D studios & games";
const description = cleanDescription(
  "Free online tools, advanced 3D house modeler, and browser games. Calculate, convert, build, and play — no signup.",
);
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "online tools, 3D house modeler, browser games, free calculators, converters, advanced tools, UtiliHub",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteSchema()),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    // analytics optional; no-op if unavailable
  }, []);

  return (
    <main className="relative overflow-hidden">
      <section className="relative px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Tools, studios & games
          </p>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Free online tools to solve what you need in seconds.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
            Calculate and convert everyday tasks — plus advanced 3D studios and free browser games. No signup.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/tools"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500"
            >
              Explore advanced tools
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="/games"
              className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              Play games
            </a>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Full catalog
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <li className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" aria-hidden /> No signup
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" aria-hidden /> Free
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" aria-hidden /> Local privacy
            </li>
          </ul>
        </div>
      </section>

      <section className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Quick access</p>
              <Suspense fallback={<span className="text-xs text-slate-400">…</span>}>
                <HomeToolCount locale="en" />
              </Suspense>
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">What do you want to solve?</h2>
            <div className="mt-4">
              <Suspense fallback={<div className="h-12 rounded-xl bg-slate-100" />}> 
                <HomeSearch locale="en" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <HomeCatalogSlot>
            <Suspense fallback={<div className="min-h-[192px] rounded-xl bg-slate-50" aria-hidden />}>
              <HomeCatalogRest locale="en" />
            </Suspense>
          </HomeCatalogSlot>
        </div>
      </section>

      <AdBanner />
      <DeferredHomeReviews locale="en" />
    </main>
  );
}
