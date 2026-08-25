/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, ogImage } from "@/lib/seo";
import { useShareableParams } from "@/hooks/use-shareable-params";

function NotFound() { return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><p className="text-sm font-semibold text-primary">UTILIHUB</p><h1 className="mt-2 text-6xl font-bold">404</h1><p className="mt-4 text-muted-foreground">La página que buscas no existe o fue movida.</p><Link to="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Volver al inicio</Link></div></div>; }
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) { const router = useRouter(); useEffect(() => console.error(error), [error]); return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold">No pudimos cargar esta página</h1><p className="mt-2 text-sm text-muted-foreground">Ha ocurrido un error. Puedes reintentar o volver al inicio.</p><div className="mt-6 flex justify-center gap-2"><button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => { router.invalidate(); reset(); }}>Reintentar</button><a href="/" className="rounded-lg border border-input px-4 py-2 text-sm font-semibold">Inicio</a></div></div></div>; }

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: `${SITE_NAME} · Herramientas online gratis` }, { name: "description", content: DEFAULT_DESCRIPTION }, { name: "robots", content: "index, follow, max-image-preview:large" }, { name: "theme-color", content: "#071a24" }, { property: "og:title", content: `${SITE_NAME} · Herramientas online gratis` }, { property: "og:description", content: DEFAULT_DESCRIPTION }, { property: "og:type", content: "website" }, { property: "og:url", content: SITE_URL }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() }, { property: "og:image:width", content: "1200" }, { property: "og:image:height", content: "630" }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: `${SITE_NAME} · Herramientas online gratis` }, { name: "twitter:description", content: DEFAULT_DESCRIPTION }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" }, { rel: "canonical", href: SITE_URL }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: DEFAULT_DESCRIPTION }) }] }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) { return <html lang="es"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); useShareableParams(); return <QueryClientProvider client={queryClient}><SiteHeader /><CommandPalette /><main><Outlet /></main><SiteFooter /><Analytics /><SpeedInsights /></QueryClientProvider>; }
