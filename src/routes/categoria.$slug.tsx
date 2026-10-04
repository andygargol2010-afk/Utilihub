import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { allCategoryBySlug } from "@/lib/all-tools";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    if (!allCategoryBySlug(params.slug)) throw notFound();
    throw redirect({
      to: "/es/categoria/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
