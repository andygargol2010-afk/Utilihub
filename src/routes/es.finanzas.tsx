import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout for /es/finanzas and /es/finanzas/$slug.
 * Canonical/og must live only on the index and $slug routes, not here,
 * or every finance tool inherits the hub canonical and fails to index.
 */
export const Route = createFileRoute("/es/finanzas")({
  component: SpanishFinanceLayout,
});

function SpanishFinanceLayout() {
  return <Outlet />;
}
