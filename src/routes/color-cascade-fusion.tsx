import { createFileRoute } from "@tanstack/react-router";
import { ColorCascadeFusionGame } from "@/components/games/ColorCascadeFusionGame";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";
import { ExperienceShareButton } from "@/components/ExperienceShareButton";

const title = "Color Cascade Fusion | UtiliHub";
const description = cleanDescription(
  "Interactive arcade: fuse falling colored orbs by clicking adjacent matches. Build chains, score combos, and share your high score. No accounts.",
);

export const Route = createFileRoute("/color-cascade-fusion")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/color-cascade-fusion") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/color-cascade-fusion") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/color-cascade-fusion") },
    ],
  }),
  component: ColorCascadePage,
});

function ColorCascadePage() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl("/color-cascade-fusion");
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-500">Games · Arcade fusion</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Color Cascade Fusion</h1>
          </div>
          <ExperienceShareButton
            title="Color Cascade Fusion"
            url={shareUrl}
            locale="en"
            variant="button"
            className="shrink-0"
          />
        </div>
        <p className="mt-3 text-muted-foreground">
          Colored orbs fall under gravity. Click adjacent matching colors to fuse them into larger orbs, trigger chain reactions, and climb the score. Levels raise speed. Share your best.
        </p>
      </header>
      <ColorCascadeFusionGame locale="en" />
      <PlaygroundNextStep currentId="color-cascade-fusion" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
