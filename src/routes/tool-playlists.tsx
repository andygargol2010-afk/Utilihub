import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const ToolPlaylists = lazy(() =>
  import("@/components/tool-playlists/ToolPlaylists").then((m) => ({ default: m.ToolPlaylists })),
);

const title = "Tool Playlists — step-by-step workflows of free tools | UtiliHub";
const description = cleanDescription(
  "Pick a goal like planning a move, hosting a dinner or getting out of debt and follow an ordered playlist of free UtiliHub tools, each step with a one-line reason. No accounts, nothing leaves your device.",
);

export const Route = createFileRoute("/tool-playlists")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/tool-playlists") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/tool-playlists") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/tool-playlists") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/listas-de-herramientas") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/tool-playlists") },
    ],
  }),
  component: ToolPlaylistsPage,
});

function ToolPlaylistsPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Curated workflows</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tool playlists</h1>
        <p className="mt-3 text-muted-foreground">
          Pick a goal and follow a short, ordered playlist of real UtiliHub tools. Every step says why it comes next and opens the tool in one tap.
        </p>
      </header>
      <div className="max-w-2xl">
        <Suspense fallback={<div className="min-h-[320px] rounded-2xl border border-border bg-card" aria-busy="true" />}>
          <ToolPlaylists locale="en" />
        </Suspense>
      </div>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
