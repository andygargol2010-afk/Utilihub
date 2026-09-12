import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/educacion/$subject")({
  loader: ({ params }) => {
    throw redirect({ to: "/education/$subject", params: { subject: params.subject } });
  },
});
