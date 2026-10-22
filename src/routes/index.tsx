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
      <style>{
        /* Critical CSS so home LCP (h1) paints before the full styles.css */
        `.hero-gradient{background-image:linear-gradient(to right,color-mix(in oklab,var(--color-border) 48%,transparent) 1px,transparent 1px),linear-gradient(to bottom,color-mix(in oklab,var(--color-border) 48%,transparent) 1px,transparent 1px),radial-gradient(70% 80% at 8% 0%,color-mix(in oklab,var(--color-primary) 20%,transparent),transparent 70%),radial-gradient(60% 70% at 95% 10%,color-mix(in oklab,var(--color-highlight) 18%,transparent),transparent 65%),linear-gradient(180deg,oklch(.99 .008 255),var(--color-background));background-size:36px 36px,36px 36px,auto,auto,auto}` +
        `.container-page{width:100%;margin-inline:auto;max-width:84rem;padding-inline:clamp(1rem,3vw,2rem)}` +
        `h1{font-family:"Plus Jakarta Sans","Plus Jakarta Fallback",ui-sans-serif,system-ui,sans-serif;font-weight:800;letter-spacing:-0.04em;line-height:1.03}` +
        `.shadow-lift{box-shadow:0 20px 46px -26px rgba(41,50,110,.38)}` +
        `.surface-card{background:color-mix(in oklab,var(--color-card) 94%,transparent);border:1px solid var(--color-border);border-radius:1.25rem;box-shadow:0 1px 2px rgba(20,28,60,.04),0 20px 48px -30px rgba(41,50,110,.3)}`
      }</style>
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="/category/advanced-tools"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition hover:opacity-95"
              >
                Explore advanced tools <ArrowRight className="size-4" />
              </a>
              <a
                href="/games"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent"
              >
                Play games
              </a>
              <Link
                to="/tools"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent"
              >
                Full catalog
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600" aria-hidden /> No signup
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600" aria-hidden /> Free
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-600" aria-hidden /> Local privacy
              </li>
            </ul>
          </div>
          <div className="surface-card p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Quick access</p>
              <Suspense fallback={<span className="text-xs text-muted-foreground">…</span>}>
                <HomeToolCount locale="en" />
              </Suspense>
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">What do you want to solve?</h2>
            <div className="mt-4">
              <Suspense fallback={<div className="h-12 rounded-xl bg-muted" />}>
                <HomeSearch locale="en" />
              </Suspense>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <a href="/category/advanced-tools" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                Advanced
              </a>
              <a href="/games" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                Games
              </a>
              <a href="/category/math" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                Math
              </a>
              <a href="/finance" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                Finance
              </a>
              <a href="/category/text" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                Text
              </a>
              <a href="/category/converters" className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent">
                Converters
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <HomeCatalogSlot>
          <Suspense fallback={<div className="min-h-[192px] rounded-xl bg-muted/40" aria-hidden />}>
            <HomeCatalogRest locale="en" />
          </Suspense>
        </HomeCatalogSlot>
      </section>

      <div className="container-page pb-8">
        <AdBanner />
        <DeferredHomeReviews locale="en" />
      </div>
    </div>
  );
}
