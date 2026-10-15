import { createFileRoute } from "@tanstack/react-router";
import { EchoWaveSignature } from "@/components/playgrounds/EchoWaveSignature";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Firma de Onda Eco | UtiliHub";
const description = cleanDescription(
  "Escribí un nombre o frase. Generá una forma de onda animada multicapa única a partir de frecuencias de caracteres y hash. Hacé clic para crear ondas que interfieren. Descarga PNG compartible.",
);

export const Route = createFileRoute("/es/echo-wave")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/echo-wave") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/echo-wave") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/echo-wave") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/echo-wave") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/echo-wave") },
    ],
  }),
  component: EchoWavePageEs,
});

function EchoWavePageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Experiencia · Compartible</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Firma de Onda Eco</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí un nombre o frase. Surge una <strong className="font-semibold text-foreground">forma de onda sinusoidal multicapa única</strong> a partir de frecuencias de códigos de caracteres y hash.
          Hacé clic o arrastrá en el canvas para crear ondas que interfieren. Descargá un PNG para compartir.
        </p>
      </header>
      <EchoWaveSignature locale="es" />

      <PlaygroundNextStep currentId="echo-wave" locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
