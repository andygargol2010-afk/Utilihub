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
    if (!loaderData) return { meta: [{ title: "Subject not found | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { slug, name } = loaderData;
    const title = `${name} quizzes online | Primary, secondary, and university | UtiliHub`;
    const description = cleanDescription(`Generate ${name} quizzes by topic for primary, secondary, and university. Choose difficulty and number of questions and start practicing for free.`);
    const url = absoluteUrl(`/educacion/${slug}`);
    return { meta: [
      { title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" },
    ], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [
      { "@type": "CollectionPage", name: title, description, url },
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Education", path: "/categoria/educacion" }, { name: name }]),
    ] }) }] };
  },
  component: EducationSubjectPage,
});

function EducationSubjectPage() {
  const { name, tools } = Route.useLoaderData();
  return <div className="container-page py-10">
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Education", to: "/categoria/$slug", params: { slug: "educacion" } }, { label: name }]} />
    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{name} quizzes</h1>
    <p className="mt-3 max-w-3xl text-muted-foreground">Generate free quizzes for {name} by topic. You can choose primary, secondary, or university, plus difficulty and number of questions.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
    <p className="mt-10 text-sm text-muted-foreground">Available topics: {tools.map((tool) => tool.name.replace(/^Quiz creator: /, "")).map((topic) => educationTopicTitle(topic)).join(", ")}.</p>
  </div>;
}
