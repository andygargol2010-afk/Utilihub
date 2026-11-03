import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params }) => {
    // Dynamic: route loaders stay in the client entry; a static import ships the whole catalog.
    const { allCategoryBySlug } = await import("@/lib/all-tools");
    if (!allCategoryBySlug(params.slug)) throw notFound();
    throw redirect({
      to: "/es/categoria/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
