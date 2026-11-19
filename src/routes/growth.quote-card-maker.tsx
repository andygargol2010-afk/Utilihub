import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const QuoteCardMaker = lazy(() =>
  import("@/components/growth/QuoteCardMaker").then((m) => ({ default: m.QuoteCardMaker })),
);

const title = "Quote Card Maker | UtiliHub";
const description = cleanDescription(
  "Create beautiful branded quote cards. Enter a quote, pick style and background, see live preview, download PNG or share.",
);

export const Route = createFileRoute("/growth/quote-card-maker")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/growth/quote-card-maker") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/growth/quote-card-maker") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/quote-card-maker") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/creador-tarjetas-citas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/quote-card-maker") },
    ],
  }),
  component: QuoteCardPage,
});

function QuoteCardPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-500">Growth · Share hooks</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Quote Card Maker</h1>
        <p className="mt-3 text-muted-foreground">
          Turn any quote into a polished branded card. Pick a style and background, preview live, then download or share.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <QuoteCardMaker locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
