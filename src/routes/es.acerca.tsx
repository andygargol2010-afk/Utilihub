import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/es/acerca")({
  loader: () => {
    throw redirect({ to: "/es/sobre" });
  },
});
