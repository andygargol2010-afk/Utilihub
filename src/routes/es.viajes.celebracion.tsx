import { createFileRoute } from "@tanstack/react-router";
import { CelebrationJourney } from "@/components/journeys/CelebrationJourney";
import { absoluteUrl, hreflangLinks, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Viaje de celebración | UtiliHub";
const description = cleanDescription("Flujo guiado multi-paso para planificar una celebración. Ocasión, invitados, presupuesto interactivo, lista de tareas y tarjeta de invitación en vivo. Estado compartible.");

export const Route = createFileRoute("/es/viajes/celebracion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/viajes/celebracion") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/viajes/celebracion") },
      ...hreflangLinks("/journeys/celebration", "/es/viajes/celebracion"),
    ],
  }),
  component: CelebracionPage,
});

function CelebracionPage() {
  return (
    <main className="container-page py-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Viaje</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Viaje de celebración</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Planificá tu evento en pasos guiados. Ocasión e invitados visuales, presupuesto interactivo, lista de tareas y tarjeta de invitación en vivo. Compartí el estado completo por URL.
        </p>
      </header>
      <CelebrationJourney locale="es" />
    </main>
  );
}
