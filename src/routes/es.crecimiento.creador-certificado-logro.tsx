import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const AchievementCertificateMaker = lazy(() =>
  import("@/components/growth/AchievementCertificateMaker").then((m) => ({ default: m.AchievementCertificateMaker })),
);

const title = "Creador de Certificado de Logro | UtiliHub";
const description = cleanDescription(
  "Crea un certificado de logro personalizado. Elige plantilla, introduce nombre y título, ve la vista previa en vivo, descarga PNG o comparte el enlace.",
);

export const Route = createFileRoute("/es/crecimiento/creador-certificado-logro")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/crecimiento/creador-certificado-logro") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/crecimiento/creador-certificado-logro") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/creador-certificado-logro") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/achievement-certificate-maker") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/achievement-certificate-maker") },
    ],
  }),
  component: CertificadoPage,
});

function CertificadoPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Crecimiento · Superficies para compartir</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Creador de Certificado de Logro</h1>
        <p className="mt-3 text-muted-foreground">
          Diseña un certificado personal. Elige plantilla y colores, completa los datos, previsualiza en vivo, luego descarga o comparte el enlace.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <AchievementCertificateMaker locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
