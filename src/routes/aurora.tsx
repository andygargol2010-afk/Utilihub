import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraNameFlow } from "@/components/playgrounds/AuroraNameFlow";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";
import { PlaygroundNextStep } from "@/components/playgrounds/PlaygroundNextStep";

const title = "Aurora Name Flow | UtiliHub";
const description = cleanDescription(
  "Type a short name or phrase. Particles and light ribbons form the letters in a flowing aurora. Mouse or touch stirs the flow, bends ribbons and creates temporary light trails. Tune density, speed and aurora moods. Shareable link, social buttons and PNG download.",
);

export const Route = createFileRoute("/aurora")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/aurora") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/aurora") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/aurora") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/aurora") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/aurora") },
    ],
  }),
  component: AuroraPage,
});

function AuroraPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">Experience · Shareable</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Aurora Name Flow</h1>
        <p className="mt-3 text-muted-foreground">
          Type a short name or phrase. Particles and light ribbons <strong className="font-semibold text-foreground">form the letters in a flowing aurora</strong>. Mouse or touch stirs the flow, bends ribbons and creates temporary light trails.
          Tune density, flow speed and aurora moods — then share the link or download a PNG.
        </p>
      </header>
      <AuroraNameFlow locale="en" />

      <PlaygroundNextStep currentId="aurora" locale="en" />
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
