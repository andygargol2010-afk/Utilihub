import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy path without /es — permanent redirect to English finance hub. */
export const Route = createFileRoute("/finanzas")({
  loader: () => {
    throw redirect({ to: "/finance", statusCode: 301 });
  },
  component: () => null,
});
