import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/aviso-legal")({
  loader: () => {
    throw redirect({ to: "/legal" });
  },
});
