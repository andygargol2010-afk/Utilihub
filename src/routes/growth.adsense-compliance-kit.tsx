import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const AdsenseComplianceKit = lazy(() =>
  import("@/components/growth/AdsenseComplianceKit").then((m) => ({ default: m.AdsenseComplianceKit })),
);

const title = "AdSense Compliance Kit | UtiliHub";
const description = cleanDescription(
  "Interactive AdSense readiness checklist. Toggle compliance items, see live score 0-100 with tips, download branded PNG scorecard.",
);

export const Route = createFileRoute("/growth/adsense-compliance-kit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/growth/adsense-compliance-kit") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/growth/adsense-compliance-kit") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/adsense-compliance-kit") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/kit-cumplimiento-adsense") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/adsense-compliance-kit") },
    ],
  }),
  component: AdsenseCompliancePage,
});

function AdsenseCompliancePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Growth · AdSense prep</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">AdSense Compliance Kit</h1>
        <p className="mt-3 text-muted-foreground">
          Walk through discrete readiness checks. Toggle items, watch your score update live with tips, then download a branded scorecard PNG.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <AdsenseComplianceKit locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
