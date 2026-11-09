import { createFileRoute } from "@tanstack/react-router";
import { ReturnStreakBoard } from "@/components/experiences/ReturnStreakBoard";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Tablero de Racha de Retorno | UtiliHub";
const description = cleanDescription(
  "Tablero visual ligero que registra tus rachas de visita y últimas experiencias jugadas mediante localStorage. Nodos animados y anillos de pulso destacan lo que toca retomar. Sin cuentas.",
);

export const Route = createFileRoute("/es/return-streak-board")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/return-streak-board") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/return-streak-board") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/return-streak-board") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/return-streak-board") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/return-streak-board") },
    ],
  }),
  component: ReturnStreakBoardPageEs,
});

function ReturnStreakBoardPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retención · Tablero visual</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tablero de Racha de Retorno</h1>
        <p className="mt-3 text-muted-foreground">
          Tablero visual ligero que registra rachas de visita y últimas experiencias mediante localStorage. Nodos animados y anillos de pulso muestran lo que toca retomar.
        </p>
      </header>
      <ReturnStreakBoard locale="es" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
