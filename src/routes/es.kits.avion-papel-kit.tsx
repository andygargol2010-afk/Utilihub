import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const PaperAirplaneKit = lazy(() =>
  import("@/components/kits/PaperAirplaneKit").then((m) => ({ default: m.PaperAirplaneKit })),
);

const title = "Kit de Avión de Papel | UtiliHub";
const description = cleanDescription(
  "Kit interactivo de diseño de avión de papel. Selecciona un diseño, sigue los pasos de plegado con casillas y ve una vista previa CSS en vivo.",
);

export const Route = createFileRoute("/es/kits/avion-papel-kit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/kits/avion-papel-kit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/kits/avion-papel-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/kits/avion-papel-kit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/kits/paper-airplane-kit") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/kits/paper-airplane-kit") },
    ],
  }),
  component: AvionPapelPage,
});

function AvionPapelPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Kit · Manualidades de papel</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Kit de Avión de Papel</h1>
        <p className="mt-3 text-muted-foreground">
          Elige un diseño, sigue los pasos de plegado y observa cómo se actualiza la vista previa en vivo.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <PaperAirplaneKit locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
