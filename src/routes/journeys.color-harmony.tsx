import { createFileRoute } from "@tanstack/react-router";
import { ColorHarmonyJourney } from "@/components/journeys/ColorHarmonyJourney";
import { absoluteUrl, hreflangLinks, ogImage, SITE_NAME, cleanDescription } from "@/lib/seo";

const title = "Color Harmony Journey | UtiliHub";
const description = cleanDescription("Interactive multi-step color palette builder. Choose a base color and harmony type — complementary, analogous, or triadic. Live HEX and HSL.");

export const Route = createFileRoute("/journeys/color-harmony")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/journeys/color-harmony") },
      { property: "og:image", content: ogImage() },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/journeys/color-harmony") },
      ...hreflangLinks("/journeys/color-harmony", "/es/viajes/armonia-color"),
    ],
  }),
  component: ColorHarmonyPage,
});

function ColorHarmonyPage() {
  return (
    <main className="container-page py-8">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Journey</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Color Harmony</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Build a palette in two steps. The preview updates live as you change the base color or harmony type.
        </p>
      </header>
      <ColorHarmonyJourney locale="en" />
    </main>
  );
}
