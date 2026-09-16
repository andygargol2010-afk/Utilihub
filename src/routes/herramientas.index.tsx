import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy /herramientas without /es → English tools index (301). */
export const Route = createFileRoute("/herramientas/")({
  loader: () => {
    throw redirect({ to: "/tools", statusCode: 301 });
  },
  component: () => null,
});
