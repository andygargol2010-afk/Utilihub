import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/finanzas")({
  loader: () => { throw redirect({ to: "/finance" }); },
  component: () => null,
});
