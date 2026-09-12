import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/hubs/documentos-y-archivos")({
  loader: () => {
    throw redirect({ to: "/hubs/documents-and-files" });
  },
});
