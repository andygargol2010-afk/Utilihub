import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, hreflangLinks, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Viajes | UtiliHub";
const description = cleanDescription("Viajes interactivos multi-paso. Construí paletas de color y más experiencias guiadas en el navegador.");

export const Route = createFileRoute("/es/viajes")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/viajes") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/es/viajes") }, ...hreflangLinks("/journeys", "/es/viajes")],
  }),
  component: ViajesIndex,
});

function ViajesIndex() {
  return (
    <main className="container-page py-8">
      <h1 className="text-3xl font-black tracking-tight">Viajes</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Experiencias guiadas multi-paso. Empezá con la armonía de color.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/es/viajes/armonia-color"
          className="surface-card group block p-6 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Color</p>
          <h2 className="mt-1 text-xl font-black group-hover:text-primary">Viaje de armonía de color</h2>
          <p className="mt-2 text-sm text-muted-foreground">Elegí un color base y un tipo de armonía. Mirá la paleta en vivo con HEX y HSL.</p>
          <span className="mt-4 inline-block text-sm font-bold text-primary">Empezar viaje →</span>
        </Link>
      </section>
    </main>
  );
}
