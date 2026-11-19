import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const UtiliTypeQuiz = lazy(() =>
  import("@/components/share/UtiliTypeQuiz").then((m) => ({ default: m.UtiliTypeQuiz })),
);

const title = "Utili Type Quiz | UtiliHub";
const description = cleanDescription(
  "Answer a few preference questions and discover your personalized Utili Type archetype. Get matching tool and game recommendations, then share your result.",
);

export const Route = createFileRoute("/share/utili-type-quiz")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/share/utili-type-quiz") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/share/utili-type-quiz") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/share/utili-type-quiz") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/compartir/utili-type-quiz") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/share/utili-type-quiz") },
    ],
  }),
  component: UtiliTypeQuizPage,
});

function UtiliTypeQuizPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Share · Personality Quiz</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Utili Type Quiz</h1>
        <p className="mt-3 text-muted-foreground">
          Answer 8 short questions about how you like to explore UtiliHub. Discover your archetype and get tailored recommendations.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <UtiliTypeQuiz locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
