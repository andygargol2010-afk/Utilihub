import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ProgressPassport = lazy(() =>
  import("@/components/growth/ProgressPassport").then((m) => ({ default: m.ProgressPassport })),
);

const title = "Pasaporte de Progreso | UtiliHub";
const description = cleanDescription(
  "Pasaporte digital interactivo de progreso. Gana sellos completando experiencias UtiliHub, sigue tu avance, descarga PNG con marca o comparte enlace.",
);

export const Route = createFileRoute("/es/crecimiento/pasaporte-progreso")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/crecimiento/pasaporte-progreso") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/crecimiento/pasaporte-progreso") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/pasaporte-progreso") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/progress-passport") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/progress-passport") },
    ],
  }),
  component: PasaporteProgresoPage,
});

function PasaporteProgresoPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Crecimiento · Retención</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Pasaporte de Progreso</h1>
        <p className="mt-3 text-muted-foreground">
          Gana sellos discretos a través de kits, juegos y simuladores UtiliHub. Observa cómo crece tu colección, luego comparte un PNG con marca o enlace profundo.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <ProgressPassport locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
