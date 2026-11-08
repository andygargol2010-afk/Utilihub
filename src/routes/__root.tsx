import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, ogImage } from "@/lib/seo";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { AdsConfigContext, ADS_OFF, type AdsConfig } from "@/lib/ads-config";
import { getAdsConfig } from "@/lib/ads-edge";
import { NotFound, useIsSpanish, useIsPortuguese, useIsFrench } from "./-__root.part1";
import { ErrorComponent } from "./-__root.part2";

// Locale chrome is only needed on /es and /pt. Keep it out of the EN root chunk.
const SpanishSiteHeader = lazy(() => import("@/components/SpanishSiteHeader").then((m) => ({ default: m.SpanishSiteHeader })));
const SpanishSiteFooter = lazy(() => import("@/components/SpanishSiteFooter").then((m) => ({ default: m.SpanishSiteFooter })));
const PortugueseSiteHeader = lazy(() => import("@/components/PortugueseSiteHeader").then((m) => ({ default: m.PortugueseSiteHeader })));
const PortugueseSiteFooter = lazy(() => import("@/components/PortugueseSiteFooter").then((m) => ({ default: m.PortugueseSiteFooter })));

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async (): Promise<{ ads: AdsConfig }> => {
    const ads = await getAdsConfig();
    return { ads };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} · Free online tools` },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "google-adsense-account", content: "ca-pub-1030166831962980" },
      { name: "theme-color", content: "#1d4ed8" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "UtiliHub" },
      { property: "og:title", content: `${SITE_NAME} · Free online tools` },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${SITE_NAME} · Free online tools` },
      { name: "twitter:description", content: DEFAULT_DESCRIPTION },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://www.highrevenueformat.com" },
      { rel: "icon", href: "/google-favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "icon", href: "/google-favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/google-favicon-48.png", type: "image/png", sizes: "48x48" },
      { rel: "apple-touch-icon", href: "/google-apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang = pathname === "/es" || pathname.startsWith("/es/") ? "es" : pathname === "/pt" || pathname.startsWith("/pt/") ? "pt" : pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
  return (
    <html lang={lang}>
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function DeferredInsights() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 4000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(enable, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function FrenchMinimalHeader() {
  return (
    <header className="border-b border-border/70 bg-background/95">
      <div className="container-page flex h-14 items-center">
        <a href="/fr" className="text-lg font-black tracking-tight">
          UtiliHub
        </a>
      </div>
    </header>
  );
}

function FrenchMinimalFooter() {
  return (
    <footer className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
      UtiliHub · Français · SEO locale
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loaderData = Route.useLoaderData() as { ads?: typeof ADS_OFF } | undefined;
  const ads = loaderData?.ads ?? ADS_OFF;
  const isSpanish = useIsSpanish();
  const isPortuguese = useIsPortuguese();
  const isFrench = useIsFrench();

  return (
    <QueryClientProvider client={queryClient}>
      <AdsConfigContext.Provider value={ads}>
      <FavoritesProvider>
        <Suspense fallback={null}>
          {isFrench ? (
            <FrenchMinimalHeader />
          ) : isPortuguese ? (
            <PortugueseSiteHeader />
          ) : isSpanish ? (
            <SpanishSiteHeader />
          ) : (
            <SiteHeader />
          )}
        </Suspense>
        <main id="main-content">
          <Outlet />
        </main>
        <Suspense fallback={null}>
          {isFrench ? (
            <FrenchMinimalFooter />
          ) : isPortuguese ? (
            <PortugueseSiteFooter />
          ) : isSpanish ? (
            <SpanishSiteFooter />
          ) : (
            <SiteFooter />
          )}
        </Suspense>
        <DeferredInsights />
      </FavoritesProvider>
      </AdsConfigContext.Provider>
    </QueryClientProvider>
  );
}
