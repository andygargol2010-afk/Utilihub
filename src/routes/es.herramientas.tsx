import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout for /es/herramientas and /es/herramientas/$slug.
 * Do NOT set canonical/og:url here — TanStack merges parent+child head tags
 * and a hub canonical would leak onto every tool page (hurts indexing).
 * Index SEO lives in es.herramientas.index.tsx; tool SEO in es.herramientas.$slug.tsx.
 */
export const Route = createFileRoute("/es/herramientas")({
  component: SpanishToolsLayout,
});

function SpanishToolsLayout() {
  return <Outlet />;
}
