import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { allToolBySlug } from "@/lib/all-tools";
import { englishToolPath, englishToolSlug } from "@/lib/route-slugs";

/**
 * Legacy Spanish path without /es prefix.
 * Permanent redirect so Google consolidates to the English canonical tool URL
 * (and stops reporting transient 5xx on these old paths).
 */
export const Route = createFileRoute("/herramientas/$slug")({
  loader: ({ params }) => {
    const tool = allToolBySlug(params.slug);
    if (!tool || tool.category === "finanzas") throw notFound();
    throw redirect({
      to: englishToolPath(tool) as "/tools/$slug",
      params: { slug: englishToolSlug(tool) },
      statusCode: 301,
    });
  },
  component: () => null,
});
