import { createFileRoute } from "@tanstack/react-router";
import { ReturnStreakBoard } from "@/components/experiences/ReturnStreakBoard";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Return Streak Board | UtiliHub";
const description = cleanDescription(
  "Lightweight visual board that tracks your visit streaks and last-played experiences via localStorage. Animated nodes and pulse rings highlight what is due to return. No accounts.",
);

export const Route = createFileRoute("/return-streak-board")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/return-streak-board") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/return-streak-board") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/return-streak-board") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/return-streak-board") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/return-streak-board") },
    ],
  }),
  component: ReturnStreakBoardPage,
});

function ReturnStreakBoardPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retention · Visual board</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Return Streak Board</h1>
        <p className="mt-3 text-muted-foreground">
          A lightweight visual board that tracks visit streaks and last-played playgrounds via localStorage only. Animated nodes and pulse rings show what is due to return.
        </p>
      </header>
      <ReturnStreakBoard locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
