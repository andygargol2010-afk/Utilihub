import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const QuoteCardMaker = lazy(() =>
  import("@/components/growth/QuoteCardMaker").then((m) => ({ default: m.QuoteCardMaker })),
);

const title = "Creador de Tarjetas de Citas | UtiliHub";
const description = cleanDescription(
  "Crea hermosas tarjetas de citas con marca. Introduce una cita, elige estilo y fondo, ve la vista previa en vivo, descarga PNG o comparte.",
);

export const Route = createFileRoute("/es/crecimiento/creador-tarjetas-citas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/crecimiento/creador-tarjetas-citas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/crecimiento/creador-tarjetas-citas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/creador-tarjetas-citas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/quote-card-maker") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/quote-card-maker") },
    ],
  }),
  component: CreadorTarjetasPage,
});

function CreadorTarjetasPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">Crecimiento · Ganchos para compartir</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Creador de Tarjetas de Citas</h1>
        <p className="mt-3 text-muted-foreground">
          Convierte cualquier cita en una tarjeta pulida con marca. Elige estilo y fondo, previsualiza en vivo, luego descarga o comparte.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <QuoteCardMaker locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
