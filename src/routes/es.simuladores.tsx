import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/es/simuladores")({
  component: SimulatorsLayoutEs,
});

function SimulatorsLayoutEs() {
  return <Outlet />;
}
