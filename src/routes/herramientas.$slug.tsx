import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { allToolBySlug } from "@/lib/all-tools";
import { englishToolPath, englishToolSlug } from "@/lib/route-slugs";

export const Route = createFileRoute("/herramientas/$slug")({
  loader: ({ params }) => {
    const tool = allToolBySlug(params.slug);
    if (!tool || tool.category === "finanzas") throw notFound();
    throw redirect({ to: englishToolPath(tool) as "/tools/$slug", params: { slug: englishToolSlug(tool) } });
  },
  component: () => null,
});
