import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout for /games and /games/$slug — no canonical here (child owns SEO). */
export const Route = createFileRoute("/games")({
  component: GamesLayout,
});

function GamesLayout() {
  return <Outlet />;
}
