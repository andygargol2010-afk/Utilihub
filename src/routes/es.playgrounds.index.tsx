import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Playgrounds | UtiliHub";
const description = cleanDescription(
  "Playgrounds visuales interactivos en el navegador. Experimentá con partículas, física y controles en vivo.",
);

export const Route = createFileRoute("/es/playgrounds/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds") },
    ],
  }),
  component: PlaygroundsHubEs,
});

function PlaygroundsHubEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">En vivo · Visual · Interactivo</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Playgrounds</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pequeños experimentos visuales. Cambiá parámetros y mirá el resultado al instante.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/es/playgrounds/particulas"
          className="group flex flex-col rounded-3xl border border-sky-900/15 bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-lg"
        >
          <span className="text-4xl" aria-hidden>
            ✨
          </span>
          <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Partículas</span>
          <span className="mt-1 text-xl font-bold text-slate-900">Partículas interactivas</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
            El mouse atrae o repele. Gravedad, fricción, estelas, color por velocidad. Canvas en vivo.
          </span>
          <span className="mt-5 text-sm font-bold text-sky-700">Abrir playground →</span>
        </Link>
      </div>
    </div>
  );
}
