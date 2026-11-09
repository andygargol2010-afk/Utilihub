import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy English-shaped path under /es. Canonical content lives at
 * /es/guias/rendimiento-canvas-webgl — permanent redirect for crawlers and old links.
 */
export const Route = createFileRoute("/es/guides/canvas-webgl-performance")({
  beforeLoad: () => {
    throw redirect({
      to: "/es/guias/rendimiento-canvas-webgl",
      // TanStack Start maps this to an HTTP 301 when the request is handled on the server.
      statusCode: 301 as 301,
    });
  },
});
