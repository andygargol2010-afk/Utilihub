import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { EDUCATION_SUBJECTS, educationTopicTitle } from "@/lib/general/education";
import { allToolsByCategory } from "@/lib/all-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage } from "@/lib/seo";

export const Route = createFileRoute("/educacion/$subject")({
  loader: ({ params }) => {
    const subject = EDUCATION_SUBJECTS.find(([slug]) => slug === params.subject);
    if (!subject) throw notFound();
    const [, name, topics] = subject;
    const tools = allToolsByCategory("educacion").filter((tool) => topics.some((topic) => tool.slug === `test-${params.subject}-${topic}`));
    return { slug: params.subject, name, topics, tools };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Materia no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { slug, name } = loaderData;
    const title = `Tests de ${name} online | Primaria, secundaria y universidad | UtiliHub`;
    const description = cleanDescription(`Genera tests de ${name} por tema para primaria, secundaria y universidad. Elige dificultad y cantidad de preguntas y comienza a practicar gratis.`);
    const url = absoluteUrl(`/educacion/${slug}`);
    return { meta: [
      { title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" },
    ], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [
      { "@type": "CollectionPage", name: title, description, url },
      breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Educación", path: "/categoria/educacion" }, { name: name }]),
    ] }) }] };
  },
  component: EducationSubjectPage,
});

function EducationSubjectPage() {
  const { name, tools } = Route.useLoaderData();
  return <div className="container-page py-10">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Educación", to: "/categoria/$slug", params: { slug: "educacion" } }, { label: name }]} />
    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Tests de {name}</h1>
    <p className="mt-3 max-w-3xl text-muted-foreground">Genera evaluaciones gratuitas de {name} por tema. Puedes elegir primaria, secundaria o universidad, además de dificultad y cantidad de preguntas.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
    <p className="mt-10 text-sm text-muted-foreground">Temas disponibles: {tools.map((tool) => tool.name.replace(/^Creador de tests: /, "")).map((topic) => educationTopicTitle(topic)).join(", ")}.</p>
  </div>;
}
