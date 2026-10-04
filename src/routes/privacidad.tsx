import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidad")({
  loader: () => {
    throw redirect({ to: "/es/privacidad", statusCode: 301 });
  },
});
