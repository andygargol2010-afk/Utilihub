import { Suspense, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DeferredHomeReviews } from "@/components/DeferredHomeReviews";
import { HomeCatalogSlot } from "@/components/home-catalog-slot";
import { absoluteUrl, ogImage, SITE_NAME, websiteSchema } from "@/lib/seo";
import { loadHomeCatalog } from "./-es.index.part1";
import { titleEs, descriptionEs, goRandomExperienceEs, HomeToolCount, HomeSearch, DailyExperienceSpotlight, ExperienceDiscoveryRail, HomeCatalogRest } from "./-es.index.part2";

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ ...websiteSchema(), url: absoluteUrl("/es"), inLanguage: "es" }),
      },
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
        `.hero-gradient{background:linear-gradient(180deg,var(--color-card) 0%,var(--color-background) 100%)}` +
        `.container-page{width:100%;margin-inline:auto;max-width:84rem;padding-inline:clamp(1rem,3vw,2rem)}` +
        `h1{font-family:"Plus Jakarta Sans","Plus Jakarta Fallback",ui-sans-serif,system-ui,sans-serif;font-weight:700;letter-spacing:-0.025em;line-height:1.12}` +
        `.shadow-lift{box-shadow:0 1px 2px rgba(15,23,42,.05),0 8px 24px -12px rgba(15,23,42,.12)}` +
        `.surface-card{background:var(--color-card);border:1px solid var(--color-border);border-radius:.75rem;box-shadow:0 1px 2px rgba(15,23,42,.04)}`
      }</style>
      <section className="hero-gradient border-b border-border">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-primary">
              <Suspense fallback={<span>Herramientas gratis</span>}>
                <HomeToolCount locale="es" />
              </Suspense>{" "}
              · gratis · sin registro
            </p>
            <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Herramientas online gratis para resolverlo en segundos.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Calculá y convertí tareas del día a día — más studios 3D avanzados y juegos gratis. Todo funciona en tu navegador.
            </p>
            <div className="mx-auto mt-8 min-h-14 max-w-2xl text-left">
              <Suspense fallback={<div className="h-14 animate-pulse rounded-lg border border-border bg-card" />}>
                <HomeSearch locale="es" />
              </Suspense>
            </div>
            <nav aria-label="Categorías populares" className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              {[
                ["/es/categoria/matematicas", "Matemáticas"],
                ["/es/finanzas", "Finanzas"],
                ["/es/categoria/conversiones", "Conversores"],
                ["/es/categoria/texto", "Texto"],
                ["/es/categoria/desarrollo", "Desarrollo"],
                ["/es/categoria/herramientas-avanzadas", "Herramientas avanzadas"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex min-h-9 items-center rounded-md border border-border bg-card px-3 font-medium text-foreground hover:border-primary/40 hover:text-primary"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/es/herramientas"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ver todas las herramientas <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/es/juegos"
                className="inline-flex min-h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Jugar
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <button type="button" onClick={goRandomExperienceEs} className="min-h-9 underline-offset-4 hover:text-foreground hover:underline" data-event="random-experience-click">
                Experiencia al azar
              </button>
              <Link to="/es/encuentra-tu-herramienta" className="min-h-9 leading-9 underline-offset-4 hover:text-foreground hover:underline">
                Encontrá tu herramienta
              </Link>
              <Link to="/es/crecimiento/embed-studio" className="min-h-9 leading-9 underline-offset-4 hover:text-foreground hover:underline">
                Juegos para tu sitio
              </Link>
            </p>
          </div>
        </div>
      </section>
      <div className="container-page">
        <Suspense fallback={<HomeCatalogSlot />}>
          <HomeCatalogRest locale="es" />
        </Suspense>
      </div>
      <Suspense fallback={<div className="container-page py-6 min-h-[280px]" aria-hidden />}>
        <ExperienceDiscoveryRail locale="es" />
      </Suspense>
      <Suspense fallback={<div className="container-page py-4 min-h-[120px]" aria-hidden />}>
        <DailyExperienceSpotlight locale="es" />
      </Suspense>
      <div className="container-page">
        <DeferredHomeReviews locale="es" />
      </div>
    </div>
  );
}
