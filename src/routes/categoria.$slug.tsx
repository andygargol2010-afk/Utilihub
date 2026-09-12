import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { allCategoryBySlug } from "@/lib/all-tools";
import { LEGACY_CATEGORY_REDIRECTS } from "@/lib/category-catalog";
import { englishCategorySlug } from "@/lib/route-slugs";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const internal = LEGACY_CATEGORY_REDIRECTS[params.slug] ?? params.slug;
    if (!allCategoryBySlug(internal)) throw notFound();
    throw redirect({
      to: "/category/$slug",
      params: { slug: englishCategorySlug(internal) },
      statusCode: 301,
    });
  },
  component: () => null,
});
