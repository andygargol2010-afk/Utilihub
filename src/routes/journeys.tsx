import { createFileRoute, Link } from "@tanstack/react-router";
import { absoluteUrl, hreflangLinks, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Journeys | UtiliHub";
const description = cleanDescription("Interactive multi-step journeys. Build color palettes and more guided experiences in the browser.");

export const Route = createFileRoute("/journeys")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/journeys") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/journeys") }, ...hreflangLinks("/journeys", "/es/viajes")],
  }),
  component: JourneysIndex,
});

function JourneysIndex() {
  return (
    <main className="container-page py-8">
      <h1 className="text-3xl font-black tracking-tight">Journeys</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Guided multi-step experiences. Start with color harmony.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/journeys/color-harmony"
          className="surface-card group block p-6 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Color</p>
          <h2 className="mt-1 text-xl font-black group-hover:text-primary">Color Harmony Journey</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pick a base color and a harmony type. See the live palette with HEX and HSL.</p>
          <span className="mt-4 inline-block text-sm font-bold text-primary">Start journey →</span>
        </Link>
      </section>
    </main>
  );
}
