/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter, useLocation } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, ogImage, websiteSchema } from "@/lib/seo";
import { useShareableParams } from "@/hooks/use-shareable-params";
import { useDailyStreak } from "@/hooks/use-daily-streak";

function NotFound() { return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><p className="text-sm font-semibold text-primary">UTILIHUB</p><h1 className="mt-2 text-6xl font-bold">404</h1><p className="mt-4 text-muted-foreground">The page you are looking for does not exist or was moved.</p><Link to="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Back to home</Link></div></div>; }
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) { const router = useRouter(); useEffect(() => console.error(error), [error]); return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold">We could not load this page</h1><p className="mt-2 text-sm text-muted-foreground">An error occurred. You can try again or go back home.</p><div className="mt-6 flex justify-center gap-2"><button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => { router.invalidate(); reset(); }}>Try again</button><a href="/" className="rounded-lg border border-input px-4 py-2 text-sm font-semibold">Home</a></div></div></div>; }

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: `${SITE_NAME} · Free online tools` }, { name: "description", content: DEFAULT_DESCRIPTION }, { name: "robots", content: "index, follow, max-image-preview:large" }, { name: "theme-color", content: "#4338ca" }, { property: "og:title", content: `${SITE_NAME} · Free online tools` }, { property: "og:description", content: DEFAULT_DESCRIPTION }, { property: "og:type", content: "website" }, { property: "og:url", content: SITE_URL }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() }, { property: "og:image:width", content: "1200" }, { property: "og:image:height", content: "630" }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: `${SITE_NAME} · Free online tools` }, { name: "twitter:description", content: DEFAULT_DESCRIPTION }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "icon", href: "/utilihub-logo.svg", type: "image/svg+xml" }, { rel: "apple-touch-icon", href: "/utilihub-logo.svg" }], scripts: [{ type: "application/ld+json", children: JSON.stringify(websiteSchema()) }] }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); const { pathname } = useLocation(); useShareableParams(); const { recordActivity } = useDailyStreak(); useEffect(() => { recordActivity(); }, [pathname, recordActivity]); return <QueryClientProvider client={queryClient}><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-sm font-bold focus:text-primary-foreground">Skip to content</a><SiteHeader /><main id="main-content"><Outlet /></main><SiteFooter /><Analytics /><SpeedInsights /></QueryClientProvider>; }

