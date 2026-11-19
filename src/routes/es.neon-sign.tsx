import { createFileRoute } from "@tanstack/react-router";
import { NeonSignature } from "@/components/playgrounds/NeonSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Estudio de Firma Neón | UtiliHub";
const description = cleanDescription(
  "Escribí texto y convertílo en un cartel de neón animado brillante. Brillo de tubo, parpadeo, color por hash o selector. Descargá PNG y compartí por URL. Generador de texto neón.",
);

export const Route = createFileRoute("/es/neon-sign")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/neon-sign") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/neon-sign") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/neon-sign") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/neon-sign") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/neon-sign") },
    ],
  }),
  component: NeonSignPageEs,
});

function NeonSignPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Estudio de Firma Neón</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí cualquier texto. Se convierte en un <strong className="font-semibold text-foreground">cartel de neón animado con tubo brillante</strong>, parpadeo y color derivado de un hash o del deslizador de matiz.
          Impacto visual inmediato. Descargá un PNG o compartí el estado de la URL.
        </p>
      </header>
      <NeonSignature locale="es" />

      <PlaygroundNextStep currentId="neon-sign" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
