import { createFileRoute, Link } from "@tanstack/react-router";
import { TextParticlesPlayground } from "@/components/playgrounds/TextParticlesPlayground";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Firma Visual | UtiliHub";
const description = cleanDescription(
  "Escribí tu nombre y las partículas vuelan para formarlo letra por letra. Compartible, descargable y puerta a más experiencias en UtiliHub.",
);

export const Route = createFileRoute("/es/firma-visual")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/firma-visual") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/firma-visual") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/firma-visual") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/visual-signature") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/visual-signature") },
    ],
  }),
  component: FirmaVisualPage,
});

function FirmaVisualPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Experiencia · Compartible
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Firma Visual</h1>
        <p className="mt-3 text-muted-foreground">
          Escribí tu nombre: las partículas se mueven y <strong className="font-semibold text-foreground">forman las letras</strong>.
          Compartí el enlace o descargá un PNG — y si te engancha, hay más abajo.
        </p>
        <ol className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
          <li className="rounded-full bg-violet-100 px-3 py-1">1 · Escribí</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">2 · Se forma el texto</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">3 · Compartí o descargá</li>
        </ol>
      </header>

      <TextParticlesPlayground locale="es" entryMode />

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Seguí explorando</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/es/experiences"
            className="group rounded-2xl border border-violet-900/15 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              ✨
            </span>
            <p className="mt-2 text-base font-bold text-slate-900">Hub de Experiencias</p>
            <p className="mt-1 text-sm text-slate-600">Playgrounds, simuladores, juegos y estudios.</p>
            <span className="mt-3 inline-block text-sm font-bold text-violet-700 group-hover:underline">
              Abrir hub →
            </span>
          </Link>
          <Link
            to="/es/playgrounds/firma-particulas"
            className="group rounded-2xl border border-amber-900/15 bg-gradient-to-br from-amber-50 via-white to-orange-50/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-md"
          >
            <span className="text-2xl" aria-hidden>
              🌀
            </span>
            <p className="mt-2 text-base font-bold text-slate-900">Órbitas atrayentes</p>
            <p className="mt-1 text-sm text-slate-600">Esferas que atraen partículas — el playground anterior.</p>
            <span className="mt-3 inline-block text-sm font-bold text-amber-700 group-hover:underline">
              Abrir playground →
            </span>
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          O volvé al{" "}
          <Link to="/es" className="font-semibold text-primary hover:underline">
            inicio de UtiliHub
          </Link>
          .
        </p>
      </section>

      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
