import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout for /es/juegos and /es/juegos/$slug — no canonical here (child owns SEO). */
export const Route = createFileRoute("/es/juegos")({
  component: SpanishGamesLayout,
});

function SpanishGamesLayout() {
  return <Outlet />;
}
