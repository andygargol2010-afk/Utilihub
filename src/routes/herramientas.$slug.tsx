import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { englishToolPath, englishToolSlug, usesFinanceRoute } from "@/lib/route-slugs";

/**
 * Legacy Spanish path without /es prefix.
 * Permanent redirect so Google consolidates to the English canonical tool URL
 * (and stops reporting transient 5xx on these old paths).
 */
export const Route = createFileRoute("/herramientas/$slug")({
  loader: async ({ params }) => {
    // Dynamic: route loaders stay in the client entry; a static import ships the whole catalog.
    const { allToolBySlug } = await import("@/lib/all-tools");
    const tool = allToolBySlug(params.slug);
    if (!tool || usesFinanceRoute(tool)) throw notFound();
    throw redirect({
      to: englishToolPath(tool) as "/tools/$slug",
      params: { slug: englishToolSlug(tool) },
      statusCode: 301,
    });
  },
  component: () => null,
});
