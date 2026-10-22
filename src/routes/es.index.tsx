import { lazy, Suspense, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DeferredHomeReviews } from "@/components/DeferredHomeReviews";
import { HomeCatalogSlot } from "@/components/home-catalog-slot";
import { absoluteUrl, ogImage, SITE_NAME } from "@/lib/seo";

const loadHomeCatalog = () => import("@/components/home-catalog");
const HomeToolCount = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeToolCount })));
const HomeSearch = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeSearch })));
const HomeCatalogRest = lazy(() => loadHomeCatalog().then((m) => ({ default: m.HomeCatalogRest })));

const titleEs = "UtiliHub · Herramientas online, studios 3D y juegos";
const descriptionEs =
  "Herramientas online gratis, modelador de casas 3D y juegos en el navegador. Calculá, convertí, diseñá y jugá — sin registro.";

export const Route = createFileRoute("/es/")({
  head: () => ({
    meta: [
      { title: titleEs },
      { name: "description", content: descriptionEs },
      {
        name: "keywords",
        content:
          "herramientas online, modelador casas 3D, juegos gratis navegador, calculadoras, herramientas avanzadas, UtiliHub",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: titleEs },
      { property: "og:description", content: descriptionEs },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titleEs },
      { name: "twitter:description", content: descriptionEs },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/") },
    ],
  }),
  component: SpanishHome,
});

function SpanishHome() {
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
              <Sparkles className="size-3.5" aria-hidden /> Herramientas, studios y juegos
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Herramientas online gratis para resolverlo en segundos.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Calculá y convertí tareas del día a día — más studios 3D avanzados y juegos gratis en el navegador. Sin
              registro.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/es/categoria/$slug"
                params={{ slug: "herramientas-avanzadas" }}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lift hover:-translate-y-0.5 hover:opacity-95"
              >
                Explorar avanzadas <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/es/juegos"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-violet-500/40 bg-card px-5 py-3 text-sm font-bold text-violet-800 hover:border-violet-500/60 hover:bg-violet-500/10 dark:text-violet-200"
              >
                Jugar
              </Link>
              <Link
                to="/es/herramientas"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold hover:border-primary/40 hover:bg-accent"
              >
                Catálogo completo
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Sin registro
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Gratis
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" /> Privacidad local
              </span>
            </div>
          </div>

          <div className="surface-card bg-card/80 p-3 shadow-lift sm:p-4">
            <div className="rounded-xl border border-border/70 bg-background p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Acceso rápido</p>
                  <h2 className="mt-1 text-xl font-black">¿Qué quieres resolver?</h2>
                </div>
                <Suspense fallback={<span className="inline-block h-6 w-24 rounded-full bg-accent" />}>
                  <HomeToolCount locale="es" />
                </Suspense>
              </div>
              <div className="mt-4 min-h-24">
                <Suspense fallback={<div className="h-11 animate-pulse rounded-xl bg-accent/70" />}>
                  <HomeSearch locale="es" />
                </Suspense>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-3">
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "herramientas-avanzadas" }}
                  className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 hover:border-primary/50 hover:bg-primary/10"
                >
                  Avanzadas
                </Link>
                <Link
                  to="/es/juegos"
                  className="rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2.5 hover:border-violet-500/50 hover:bg-violet-500/10"
                >
                  Juegos
                </Link>
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "matematicas" }}
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Matemáticas
                </Link>
                <Link
                  to="/es/finanzas"
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Finanzas
                </Link>
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "texto" }}
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Texto
                </Link>
                <Link
                  to="/es/categoria/$slug"
                  params={{ slug: "conversiones" }}
                  className="rounded-lg border border-border/70 bg-card px-3 py-2.5 hover:border-primary/40 hover:bg-accent"
                >
                  Conversores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page">
        <Suspense fallback={<HomeCatalogSlot />}>
          <HomeCatalogRest locale="es" />
        </Suspense>
        <DeferredHomeReviews locale="es" />
      </div>
    </div>
  );
}
