import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout for /finance and /finance/$slug.
 * Do NOT set canonical here — parent+child head merge would force every
 * calculator to claim the hub URL and block indexing (same bug as ES tools).
 */
export const Route = createFileRoute("/finance")({
  component: FinancialLayout,
});

function FinancialLayout() {
  return <Outlet />;
}
