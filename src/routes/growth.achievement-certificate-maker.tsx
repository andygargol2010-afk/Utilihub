import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const AchievementCertificateMaker = lazy(() =>
  import("@/components/growth/AchievementCertificateMaker").then((m) => ({ default: m.AchievementCertificateMaker })),
);

const title = "Achievement Certificate Maker | UtiliHub";
const description = cleanDescription(
  "Create a personalized achievement certificate. Pick a template, enter name and title, see live preview, download PNG or share a deep link.",
);

export const Route = createFileRoute("/growth/achievement-certificate-maker")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: absoluteUrl("/growth/achievement-certificate-maker") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/growth/achievement-certificate-maker") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/growth/achievement-certificate-maker") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/crecimiento/creador-certificado-logro") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/growth/achievement-certificate-maker") },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-6 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">Growth · Share surfaces</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Achievement Certificate Maker</h1>
        <p className="mt-3 text-muted-foreground">
          Design a personal certificate. Choose a template and colors, fill the details, preview live, then download or share the link.
        </p>
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
        <AchievementCertificateMaker locale="en" />
      </Suspense>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
