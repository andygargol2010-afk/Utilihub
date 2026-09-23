import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Layout for /simulators and /simulators/$slug — child owns SEO. */
export const Route = createFileRoute("/simulators")({
  component: SimulatorsLayout,
});

function SimulatorsLayout() {
  return <Outlet />;
}
