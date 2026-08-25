import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/finanzas")({
  component: FinancialLayout,
});

function FinancialLayout() {
  return <Outlet />;
}
