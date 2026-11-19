import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const UtiliTypeQuiz = lazy(() =>
  import("@/components/share/UtiliTypeQuiz").then((m) => ({ default: m.UtiliTypeQuiz })),
);

const title = "Quiz Tipo Utili | UtiliHub";
const description = cleanDescription(
  "Responde unas pocas preguntas de preferencias y descubre tu arquetipo personalizado Tipo Utili. Obtén recomendaciones de herramientas y juegos, luego comparte tu resultado.",
);

export const Route = createFileRoute("/es/compartir/utili-type-quiz")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/compartir/utili-type-quiz") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/compartir/utili-type-quiz") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/compartir/utili-type-quiz") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/share/utili-type-quiz") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/share/utili-type-quiz") },
    ],
  }),
  component: UtiliTypeQuizPageEs,
});

function UtiliTypeQuizPageEs() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Compartir · Quiz de Personalidad</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Quiz Tipo Utili</h1>
        <p className="mt-3 text-muted-foreground">
          Responde 8 preguntas cortas sobre cómo te gusta explorar UtiliHub. Descubre tu arquetipo y obtén recomendaciones a medida.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <UtiliTypeQuiz locale="es" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
