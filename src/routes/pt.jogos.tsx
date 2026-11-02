import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/pt/jogos")({
  component: PortugueseGamesLayout,
});

function PortugueseGamesLayout() {
  return <Outlet />;
}
