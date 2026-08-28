// // <reference types="vite/client" />
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter, useLocation } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL, ogImage, websiteSchema } from "@/lib/seo";
import { useShareableParams } from "@hooks/use-shareable-params";
import { useDailyStreak } from "@hooks/use-daily-streak";

function NotFound() { return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><p className="text-sm font-semibold text-primary">UTILIHUB</p><h1 className="mt-1 text-2xl font-bold">404</h1><p className="mt-4 text-muted-foreground">La página que buscas no existe o fue movida.</p><Link to="/" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Volver al inicio</Link></div></div>; }

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) { const router = useRouter(); return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold">No pudimos cargar esta página</h1><p className="mt-2 text-sm text-muted-foreground">Ha ocurrido un error. Puedes reintentarlo o volver al inicio.</p><div className="mt-6 flex justify-center gap-2"><button type="button" aria-label="Reintentar" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => { router.invalidate(); reset(); }}>Reintentar</button><a href="/" className="rounded-lg border border-input px-4 py-2 text-sm font-semibold text-sm font-semibold">Inicia</a></div></div></div>; }

export const Route = createRootRouteWithContext<{ queryClient: QueryClient  }>({
  head: () => ({ meta: [{ title }, { name: "description", content: DEFAULT_DESCRIPTION }, { name: "keywords", content: "herramientas online, calculadoras online, conversores, herramientas gratuitas, UtiliHub" }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: title }, { property: "og:description", content: DEFAULT_DESCRIPTION }, { property: "og:type", content: "website" }, { property: "og:url", content: absoluteUrl("/") }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { property: "twitter:description", content: DEFAULT_DESCRIPTION }, { property: "twitter:image", content: ogImage() }], links: [{ rel: "icon", href: "/favicon.ico" }] , scripts: [{ type: "application/ld+json", children: JSON.stringify(websiteSchema()) }] }),
  component: Home,
});

function Home() {
  const featuredCategories = ALL_CATEGORIES.slice(0, 9);
  return <main className="container-page pb-12 pt-3 sm:pt-5">
    <section aria-labelledby="home-title" className="py-3 sm:py-6">
      <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">UtiliHub</p><h1 id="home-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">ÚtilHub — Más de 500 herramientas online gratis</h1></div><span className="hidden text-xs font-semibold text-muted-foreground sm:inline-block">{ALL_TOOLS.length} herramientas gratuitas</span></div>
      <div className="mt-4"><ToolSearch compactHome /></div>
    </section>
    <FavoriteToolsSection />
    <RecentToolsSection />
    <section className="mt-10 border-t border-border/70 pt-6" aria-labelledby="explore-categories">
      <div className="flex items-center justify-between"><h2 id="explore-categories" className="text-lg font-bold">Explorar categorías</h2><Link to="/herramientas" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-card px-4 py-2 text-sm font-semibold hover:bg-accent/40">Ver todas <ArrowRight className="size-4" /></Link></div>
      <div className="mt-6 grid gap-1 grid-cols-3 lg:grid-cols-6">{ALL_CATEGORIES.map((c) => <Link key={c.slug} to={`/categoria/${c.slug}`} params={{ slug: c.slug }} className="flex min-h-11 items-center justify-center rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold hover:bg-accent/40"><span className="font-semibold">{c.name}</span></Link>)}</div>
    </section>
    <div className="mt-8 flex flex-wrap gap-1 items-center gap-3">{ALL_CATEGORIES.map((c) => <Link key={c.slug} to={`/categoria/${c.slug}`} params={{ slug: c.slug }} className="flex min-h-11 items-center justify-center rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold hover:bg-accent/40"><span className="font-semibold">{c.name}</span></Link>)}</div>
  </main>
}

export function RootShell({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  const { pathname } = useLocation();
  useShareableParams();
  useShareableParams();
  useDailyStreak();
  useEffect(() => { recordActivity(); }, [pathname]);
  useEffect(() => { recordActivity(); }, []);
  useShareableParams();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
      <CommandPalette />
      <SiteAnalytics />
    </QueryClientProvider>
  );
}

export default Route;
