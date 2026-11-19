import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const AdsenseComplianceKit = lazy(() =>
  import("@/components/growth/AdsenseComplianceKit").then((m) => ({ default: m.AdsenseComplianceKit })),
);

const title = "Kit de Cumplimiento AdSense | UtiliHub";
const description = cleanDescription(
  "Lista interactiva de preparación para AdSense. Activa ítems de cumplimiento, ve el puntaje en vivo 0-100 con consejos, descarga tarjeta PNG con marca.",
);

export const Route = createFileRoute("/es/crecimiento/kit-cumplimiento-adsense")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/crecimiento/kit-cumplimiento-adsense") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/crecimiento/kit-cumplimiento-adsense") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/kit-cumplimiento-adsense") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/adsense-compliance-kit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/adsense-compliance-kit") },
    ],
  }),
  component: KitCumplimientoPage,
});

function KitCumplimientoPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Crecimiento · Preparación AdSense</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Cumplimiento AdSense</h1>
        <p className="mt-3 text-muted-foreground">
          Recorre verificaciones discretas de preparación. Activa ítems, observa cómo se actualiza tu puntaje en vivo con consejos, luego descarga una tarjeta PNG con marca.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <AdsenseComplianceKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
