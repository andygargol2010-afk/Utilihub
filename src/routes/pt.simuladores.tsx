import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/pt/simuladores")({
  component: PortugueseSimulatorsLayout,
});

function PortugueseSimulatorsLayout() {
  return <Outlet />;
}
