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
          "online tools, 3D house modeler, free browser games, online calculators, converters, advanced tools, UtiliHub",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(websiteSchema()) }],
  }),
  component: HomePage,
});

function HomePage() {
  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(() => void loadHomeCatalog(), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => void loadHomeCatalog(), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="pb-12">
      <section className="hero-gradient border-b border-border/70">
        <div className="container-page grid gap-8 py-10 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
              <Sparkles className="size-3.5" aria-hidden /> Tools, studios & games
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Free online tools to solve what you need in seconds.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Calculate and convert everyday tasks — plus advanced 3D studios and free browser games. No signup.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/category/advanced-tools"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95"
              >
                Explore advanced tools <ArrowRight className="size-4" />
              </a>
              <Link
                to="/games"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-violet-500/40 bg-card px-5 py-3 text-sm font-bold text-violet-800 hover:border-violet-500/60 hover:bg-violet-500/10 dark:text-violet-200"
              >
                Play games
              </Link>
              <Link
                to="/tools"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary/40 hover:bg-accent"
              >
                Full catalog
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> No signup
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Free
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Local privacy
              </span>
            </div>
          </div>
          <div className="surface-card bg-card/80 p-3 shadow-lift sm:p-4">
            <div className="rounded-xl border border-border/70 bg-background p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Quick access</p>
                  <h2 className="mt-1 text-xl font-black">What do you want to solve?</h2>
                </div>
                <Suspense fallback={<span className="inline-block h-6 w-16 rounded-full bg-accent" />}>
                  <HomeToolCount locale="en" />
                </Suspense>
              </div>
              <div className="mt-4 min-h-24">
                <Suspense fallback={<div className="h-11 animate-pulse rounded-xl bg-accent/70" />}>
                  <HomeSearch locale="en" />
                </Suspense>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-3">
                <a
                  href="/category/advanced-tools"
                  className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 hover:border-primary/50 hover:bg-primary/10"
                >
                  Advanced
                </a>
                <Link
                  to="/games"
                  className="rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 hover:border-violet-500/50 hover:bg-violet-500/10"
                >
                  Games
                </Link>
                <Link to="/category/math" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                  Math
                </Link>
                <Link to="/finance" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                  Finance
                </Link>
                <Link to="/category/text" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                  Text
                </Link>
                <Link to="/category/converters" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                  Converters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AdBanner />
      <div className="container-page">
        <Suspense fallback={<HomeCatalogSlot />}>
          <HomeCatalogRest locale="en" />
        </Suspense>
        <DeferredHomeReviews locale="en" />
      </div>
    </div>
  );
}
