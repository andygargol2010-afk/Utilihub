import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { financialToolBySlug } from "@/lib/financial-tools";
import { englishToolSlug } from "@/lib/route-slugs";

export const Route = createFileRoute("/finanzas/$slug")({
  loader: ({ params }) => {
    const tool = financialToolBySlug(params.slug);
    if (!tool) throw notFound();
    throw redirect({
      to: "/finance/$slug",
      params: { slug: englishToolSlug(tool) },
      statusCode: 301,
    });
  },
  component: () => null,
});
