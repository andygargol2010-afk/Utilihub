/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouter, useLocation } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, useState, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SpanishSiteHeader } from "@/components/SpanishSiteHeader";
import { SpanishSiteFooter } from "@/components/SpanishSiteFooter";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, ogImage } from "@/lib/seo";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { AdsConfigContext, ADS_OFF, type AdsConfig } from "@/lib/ads-config";
import { getAdsConfig } from "@/lib/ads-edge";
import { isChunkLoadError } from "@/lib/chunk-errors";

function useIsSpanish() {
  const { pathname } = useLocation();
  return pathname === "/es" || pathname.startsWith("/es/");
}

function useIsPortuguese() {
  const { pathname } = useLocation();
  return pathname === "/pt" || pathname.startsWith("/pt/");
}

function useIsFrench() {
  const { pathname } = useLocation();
  return pathname === "/fr" || pathname.startsWith("/fr/");
}

function NotFound() {
  const isSpanish = useIsSpanish();
  const isPortuguese = useIsPortuguese();
  const isFrench = useIsFrench();
  useEffect(() => {
    document.title = isSpanish
      ? "Página no encontrada | UtiliHub"
      : isPortuguese
        ? "Página não encontrada | UtiliHub"
        : isFrench
          ? "Page non trouvée | UtiliHub"
          : "Page not found | UtiliHub";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
  }, [isSpanish, isPortuguese, isFrench]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">UTILIHUB</p>
        <h1 className="mt-2 text-6xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">
          {isSpanish
            ? "No encontramos esta página."
            : isPortuguese
              ? "Não encontramos esta página."
              : isFrench
                ? "Nous n'avons pas trouvé cette page."
                : "We could not find this page."}
        </p>
        <a
          href={isSpanish ? "/es" : isPortuguese ? "/pt" : isFrench ? "/fr" : "/"}
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {isSpanish ? "Ir al inicio" : isPortuguese ? "Ir para o início" : isFrench ? "Aller à l'accueil" : "Go home"}
        </a>
      </div>
    </div>
  );
}

/**
 * Server-rendered header/main/footer, captured before hydration (the entry
 * module runs after the parser has passed them) and refreshed at
 * DOMContentLoaded so streamed Suspense content is included. If a route chunk
 * fails to load (crawler renderer, flaky network) the root errorComponent shows
 * this markup instead of a full-page error, so Googlebot never sees a soft 404.
 * Only valid for the path it was captured on (not after client navigation).
 */
let ssrShellHtml: string | null = null;
let ssrShellPath: string | null = null;

function captureSsrShell() {
  const main = document.getElementById("main-content");
  if (!main) return;
  if (ssrShellPath !== null && ssrShellPath !== window.location.pathname) return;
  ssrShellPath = window.location.pathname;
  const parts: string[] = [];
  const prev = main.previousElementSibling;
  if (prev?.tagName === "HEADER") parts.push(prev.outerHTML);
  parts.push(main.outerHTML);
  const next = main.nextElementSibling;
  if (next?.tagName === "FOOTER") parts.push(next.outerHTML);
  ssrShellHtml = parts.join("");
}

if (typeof document !== "undefined") {
  captureSsrShell();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", captureSsrShell, { once: true });
  }
}

const BOT_RE =
  /bot\b|crawler|spider|crawling|Googlebot|Google-InspectionTool|AdsBot|Mediapartners|bingpreview|Slurp|DuckDuck|Baiduspider|YandexBot|facebookexternalhit|Lighthouse/i;

function isBotVisitor() {
  return typeof navigator !== "undefined" && BOT_RE.test(navigator.userAgent || "");
}

/** One automatic route retry per page load; a second failure keeps the server HTML. */
let routeRetried = false;

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { pathname } = useLocation();
  const isSpanish = useIsSpanish();
  const isPortuguese = useIsPortuguese();
  const isFrench = useIsFrench();
  const keepServerHtml =
    Boolean(ssrShellHtml) && ssrShellPath === pathname && (isChunkLoadError(error) || isBotVisitor());
  useEffect(() => console.error(error), [error]);
  useEffect(() => {
    if (!keepServerHtml || routeRetried) return;
    routeRetried = true;
    // Not cleared on re-render: the single retry must still fire if reset changes identity.
    setTimeout(() => {
      void router.invalidate().finally(() => reset());
    }, 600);
  }, [keepServerHtml, router, reset]);
  if (keepServerHtml) {
    return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: ssrShellHtml as string }} />;
  }
  const msg = error?.message?.slice(0, 280) || "";
  const stackLine = (error?.stack || "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.includes("/") || l.includes(".tsx") || l.includes(".ts") || l.includes(".js"));
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          {isSpanish
            ? "No pudimos cargar esta página"
            : isPortuguese
              ? "Não conseguimos carregar esta página"
              : isFrench
                ? "Nous n'avons pas pu charger cette page"
                : "We could not load this page"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSpanish
            ? "Ocurrió un error. Puedes intentarlo de nuevo o volver al inicio."
            : isPortuguese
              ? "Ocorreu um erro. Você pode tentar novamente ou voltar ao início."
              : isFrench
                ? "Une erreur s'est produite. Vous pouvez réessayer ou retourner à l'accueil."
                : "An error occurred. You can try again or go back home."}
        </p>
        {msg ? (
          <pre className="mt-4 max-h-32 overflow-auto rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-[11px] leading-snug text-muted-foreground">
            {msg}
            {stackLine ? `\n${stackLine}` : ""}
          </pre>
        ) : null}
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            {isSpanish ? "Reintentar" : isPortuguese ? "Tentar novamente" : isFrench ? "Réessayer" : "Try again"}
          </button>
          <a href={isSpanish ? "/es" : isPortuguese ? "/pt" : isFrench ? "/fr" : "/"} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold">
            {isSpanish ? "Inicio" : isPortuguese ? "Início" : isFrench ? "Accueil" : "Home"}
          </a>
        </div>
      </div>
    </div>
  );
}

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

function PortugueseMinimalHeader() {
  return (
    <header className="border-b border-border/70 bg-background/95">
      <div className="container-page flex h-14 items-center">
        <a href="/pt" className="text-lg font-black tracking-tight">
          UtiliHub
        </a>
      </div>
    </header>
  );
}

function PortugueseMinimalFooter() {
  return (
    <footer className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
      UtiliHub · Português (pt-BR) · SEO locale
    </footer>
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
        {isFrench ? (
          <FrenchMinimalHeader />
        ) : isPortuguese ? (
          <PortugueseMinimalHeader />
        ) : isSpanish ? (
          <SpanishSiteHeader />
        ) : (
          <SiteHeader />
        )}
        <main id="main-content">
          <Outlet />
        </main>
        {isFrench ? (
          <FrenchMinimalFooter />
        ) : isPortuguese ? (
          <PortugueseMinimalFooter />
        ) : isSpanish ? (
          <SpanishSiteFooter />
        ) : (
          <SiteFooter />
        )}
        <DeferredInsights />
      </FavoritesProvider>
      </AdsConfigContext.Provider>
    </QueryClientProvider>
  );
}
