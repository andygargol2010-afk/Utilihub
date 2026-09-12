import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/finanzas")({
  // Parent loaders run for children too — only redirect the index path.
  beforeLoad: ({ location }) => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/finanzas") {
      throw redirect({ to: "/finance", statusCode: 301 });
    }
  },
  component: () => <Outlet />,
});
