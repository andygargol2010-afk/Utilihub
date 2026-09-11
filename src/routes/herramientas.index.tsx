import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/herramientas/")({
  loader: () => { throw redirect({ to: "/tools" }); },
  component: () => null,
});
