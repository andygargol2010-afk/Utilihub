/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter, useLocation } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SpanishSiteHeader } from "@/components/SpanishSiteHeader";
import { SpanishSiteFooter } from "@/components/SpanishSiteFooter";
import { AdsterraSocialBar } from "@/components/AdsterraSocialBar";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, ogImage, websiteSchema } from "@/lib/seo";
import { useShareableParams } from "@/hooks/use-shareable-params";
import { useDailyStreak } from "@/hooks/use-daily-streak";

function useIsSpanish() {
  const { pathname } = useLocation();
  return pathname === "/es" || pathname.startsWith("/es/");
}

function NotFound() {
  const isSpanish = useIsSpanish();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">UTILIHUB</p>
        <h1 className="mt-2 text-6xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">
          {isSpanish ? "No encontramos esta página." : "We could not find this page."}
        </p>
        <a href={isSpanish ? "/es" : "/"} className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          {isSpanish ? "Ir al inicio" : "Go home"}
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const isSpanish = useIsSpanish();
  useEffect(() => console.error(error), [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          {isSpanish ? "No pudimos cargar esta página" : "We could not load this page"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isSpanish
            ? "Ocurrió un error. Puedes intentarlo de nuevo o volver al inicio."
            : "An error occurred. You can try again or go back home."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            {isSpanish ? "Reintentar" : "Try again"}
          </button>
          <a href={isSpanish ? "/es" : "/"} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold">
            {isSpanish ? "Inicio" : "Home"}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} · Free online tools` },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#4338ca" },
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap",
      },
      { rel: "icon", href: "/utilihub-logo.svg", type: "image/svg+xml", sizes: "any" },
      { rel: "apple-touch-icon", href: "/utilihub-logo.svg" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(websiteSchema()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <html lang={pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en"}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isSpanish = useIsSpanish();
  useShareableParams();
  useDailyStreak();

  return (
    <QueryClientProvider client={queryClient}>
      {isSpanish ? <SpanishSiteHeader /> : <SiteHeader />}
      <main id="main-content">
        <Outlet />
      </main>
      {isSpanish ? <SpanishSiteFooter /> : <SiteFooter />}
      <AdsterraSocialBar />
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
}
