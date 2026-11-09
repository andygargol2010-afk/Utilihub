import { createFileRoute } from "@tanstack/react-router";
import { DebtVisualizer } from "@/components/playgrounds/DebtVisualizer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Visualizador Bola de nieve vs Avalancha | UtiliHub";
const description = cleanDescription(
  "Comparación visual interactiva de métodos bola de nieve y avalancha. Agregá deudas y mirá barras de progreso y timeline en vivo.",
);

export const Route = createFileRoute("/es/playgrounds/deuda-bola-nieve")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/playgrounds/deuda-bola-nieve") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/playgrounds/deuda-bola-nieve") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/deuda-bola-nieve") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/debt-snowball") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/debt-snowball") },
    ],
  }),
  component: DeudaBolaNievePageEs,
});

function DeudaBolaNievePageEs() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Bola de nieve vs Avalancha</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Agregá tus deudas y mirá cómo compiten ambos métodos en tiempo real. Barras de progreso y meses de pago se actualizan al instante.
        </p>
      </header>
      <DebtVisualizer locale="es" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
