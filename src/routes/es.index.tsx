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
      { property: "og:image", content: typeof ogImage === "function" ? (ogImage as () => string)() : String(ogImage) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titleEs },
      { name: "twitter:description", content: descriptionEs },
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
      <section className="border-b border-border/70 bg-gradient-to-b from-background to-background">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-primary">
              <Sparkles className="size-3.5" aria-hidden /> Herramientas, studios y juegos
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Herramientas online gratis para resolverlo en segundos.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Calculá y convertí tareas del día a día — más studios 3D avanzados y juegos gratis en el navegador. Sin registro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/es/herramientas"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500"
              >
                Explorar herramientas avanzadas
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="/es/juegos"
                className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
              >
                Jugar
              </a>
              <Link
                to="/es/herramientas"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Catálogo completo
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" aria-hidden /> Sin registro
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" aria-hidden /> Gratis
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" aria-hidden /> Privacidad local
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Acceso rápido</p>
              <Suspense fallback={<span className="text-xs text-slate-400">…</span>}>
                <HomeToolCount locale="es" />
              </Suspense>
            </div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">¿Qué querés resolver?</h2>
            <div className="mt-4">
              <Suspense fallback={<div className="h-12 rounded-xl bg-slate-100" />}>
                <HomeSearch locale="es" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <HomeCatalogSlot>
            <Suspense fallback={<div className="min-h-[192px] rounded-xl bg-slate-50" aria-hidden />}>
              <HomeCatalogRest locale="es" />
            </Suspense>
          </HomeCatalogSlot>
        </div>
      </section>

      <DeferredHomeReviews locale="es" />
    </div>
  );
}
