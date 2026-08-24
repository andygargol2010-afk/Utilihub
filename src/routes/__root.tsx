/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, type ReactNode } from "react";
import "../styles.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">UTILIHUB</p>
        <h1 className="mt-2 text-6xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => console.error(error), [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">No pudimos cargar esta página</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ha ocurrido un error. Puedes reintentar o volver al inicio.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Reintentar
          </button>
          <a href="/" className="rounded-lg border border-input px-4 py-2 text-sm font-semibold">
            Inicio
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
      { title: "UtiliHub · Herramientas online gratis" },
      {
        name: "description",
        content:
          "Herramientas online gratuitas, rápidas y sin registro: calculadoras, conversores, texto, fechas y utilidades.",
      },
      { property: "og:title", content: "UtiliHub · Herramientas online gratis" },
      {
        property: "og:description",
        content: "Calculadoras, conversores y utilidades gratuitas que funcionan directamente en tu navegador.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#071a24" },
    ],
    links: [{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
}
