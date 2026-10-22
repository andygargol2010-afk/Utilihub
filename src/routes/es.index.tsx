import { lazy, Suspense, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { HomeCatalog } from "@/components/HomeCatalog";
import { Seo } from "@/components/Seo";
import { track } from "@/lib/analytics";

const DeferredReviews = lazy(() =>
  import("@/components/DeferredReviews").then((m) => ({ default: m.DeferredReviews })),
);

export const Route = createFileRoute("/es/")({
  component: EsHomePage,
});

function EsHomePage() {
  useEffect(() => {
    track("home_view", { locale: "es" });
  }, []);

  return (
    <>
      <Seo
        title="UtiliHub — Herramientas online gratis, estudios 3D y juegos"
        description="Calculá, convertí, diseñá y jugá en el navegador. Herramientas gratis, estudios 3D avanzados y juegos — sin registro."
        path="/es"
        locale="es"
      />
      <main className="relative overflow-hidden">
        <section className="relative px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Herramientas, estudios y juegos
            </p>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Herramientas online gratis para resolver lo que necesitás en segundos.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
              Calculá y convertí tareas del día a día — más estudios 3D avanzados y juegos gratis en el navegador. Sin registro.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
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
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-600">
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
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <HomeCatalog locale="es" />
          </div>
        </section>

        <Suspense fallback={null}>
          <DeferredReviews locale="es" />
        </Suspense>
      </main>
    </>
  );
}
