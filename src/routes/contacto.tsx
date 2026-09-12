import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/contacto")({
  loader: () => {
    throw redirect({ to: "/contact" });
  },
});
