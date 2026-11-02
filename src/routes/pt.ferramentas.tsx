import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/pt/ferramentas")({
  component: PortugueseToolsLayout,
});

function PortugueseToolsLayout() {
  return <Outlet />;
}
