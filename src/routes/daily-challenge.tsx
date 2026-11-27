import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const DailyChallengeHub = lazy(() =>
  import("@/components/daily-challenge/DailyChallengeHub").then((m) => ({ default: m.DailyChallengeHub })),
);

const title = "Daily Challenge — one free game goal every day | UtiliHub";
const description = cleanDescription(
  "A new free browser game goal every day. Play it, mark it done, build your streak and fill the 28-day calendar. No accounts, everything stays on your device.",
);

export const Route = createFileRoute("/daily-challenge")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/daily-challenge") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/daily-challenge") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/daily-challenge") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/reto-diario") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/daily-challenge") },
    ],
  }),
  component: DailyChallengePage,
});

function DailyChallengePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Retention · Daily habit</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Daily Challenge</h1>
        <p className="mt-3 text-muted-foreground">
          Every UTC day picks one UtiliHub game and one goal. Complete it, keep your streak alive and fill the calendar.
        </p>
      </header>
      <div className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[360px] rounded-2xl border border-border bg-card" aria-busy="true" />}>
          <DailyChallengeHub locale="en" />
        </Suspense>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
