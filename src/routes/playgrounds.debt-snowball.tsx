import { createFileRoute } from "@tanstack/react-router";
import { DebtVisualizer } from "@/components/playgrounds/DebtVisualizer";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Debt Snowball vs Avalanche Visualizer | UtiliHub";
const description = cleanDescription(
  "Interactive visual comparison of debt snowball and avalanche methods. Add debts, see live progress bars and payoff timeline.",
);

export const Route = createFileRoute("/playgrounds/debt-snowball")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/playgrounds/debt-snowball") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/playgrounds/debt-snowball") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/playgrounds/debt-snowball") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/playgrounds/deuda-bola-nieve") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/playgrounds/debt-snowball") },
    ],
  }),
  component: DebtSnowballPageEn,
});

function DebtSnowballPageEn() {
  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Playground</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">Snowball vs Avalanche</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Add your debts and watch both methods compete in real time. Progress bars and payoff months update instantly.
        </p>
      </header>
      <DebtVisualizer locale="en" />
      <div className="mt-8">
        <AdsterraBanner />
      </div>
    </div>
  );
}
