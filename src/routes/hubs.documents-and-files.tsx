import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileText, LockKeyhole } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { DOCUMENT_HUB, documentHubTools } from "@/lib/document-hub";
import { englishToolPath } from "@/lib/route-slugs";
import { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, SITE_NAME } from "@/lib/seo";

const title = `${DOCUMENT_HUB.name}: free online tools | ${SITE_NAME}`;
const description = cleanDescription("Prepare, convert, and organize documents and files with free online tools. Local processing, no signup, and a step-by-step path.");

export const Route = createFileRoute("/hubs/documents-and-files")({
  loader: () => ({
    steps: documentHubTools(DOCUMENT_HUB.steps),
    alternatives: documentHubTools(DOCUMENT_HUB.alternatives),
  }),
  head: () => ({
    meta: [
      { title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: absoluteUrl("/hubs/documents-and-files") }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/hubs/documents-and-files") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [
      { "@type": "CollectionPage", name: title, description, url: absoluteUrl("/hubs/documents-and-files") },
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Hubs", path: "/hubs/documents-and-files" }, { name: DOCUMENT_HUB.name }]),
      faqSchema([
        { q: "Are my documents uploaded to a server?", a: "Compatible tools process files directly in your browser. Check each tool's privacy note." },
        { q: "What can I do with this hub?", a: "You can clean text, check length, name files, convert images, merge PDFs, split documents, and extract text." },
        { q: "Do I need to sign up?", a: "No. The path works without an account or registration." },
      ]),
    ] }) }],
  }),
  component: DocumentHubPage,
});

function DocumentHubPage() {
  const { steps, alternatives } = Route.useLoaderData();
  return <main className="container-page py-6 sm:py-8">
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Documents and files" }]} />
    <header className="hero-gradient mt-4 rounded-2xl border border-border/70 p-6 sm:p-9">
      <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-primary"><FileText className="size-6" /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{DOCUMENT_HUB.eyebrow}</p><h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{DOCUMENT_HUB.name}</h1></div></div>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">{DOCUMENT_HUB.description}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="size-4 text-primary" /> {DOCUMENT_HUB.outcome}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5 text-primary" /> No signup</span><span>Local processing when the tool allows it</span><span>Export when done</span></div>
    </header>

    <section className="mt-9" aria-labelledby="document-hub-steps"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Recommended path</p><h2 id="document-hub-steps" className="mt-1 text-2xl font-black">Prepare your document in six steps</h2></div><Link to="/tools" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">View catalog <ArrowRight className="size-4" /></Link></div><div className="mt-5 space-y-3">{steps.map((step, index) => <div key={step.slug} className="surface-card flex gap-4 p-4 sm:p-5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">{index + 1}</span><div className="min-w-0 flex-1"><p className="mb-2 text-sm font-bold text-primary">{step.title}</p><ToolCard tool={step.tool} /><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p><Link to={englishToolPath(step.tool) as "/tools/$slug"} params={{ slug: englishToolPath(step.tool).split("/").pop()! }} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">Open tool <ArrowRight className="size-4" /></Link></div></div>)}</div></section>

    <section className="mt-10" aria-labelledby="document-hub-alternatives"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">By file type</p><h2 id="document-hub-alternatives" className="mt-1 text-2xl font-black">Other useful tools</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{alternatives.map((tool) => <div key={tool.slug} className="surface-card p-4"><ToolCard tool={tool.tool} /><p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p><Link to={englishToolPath(tool.tool) as "/tools/$slug"} params={{ slug: englishToolPath(tool.tool).split("/").pop()! }} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">Open tool <ArrowRight className="size-4" /></Link></div>)}</div></section>

    <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Hub information"><div className="surface-card p-5"><h2 className="font-black">Who is it for?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Freelancers, students, teams, and anyone who needs to prepare files before sending or publishing them.</p></div><div className="surface-card p-5"><h2 className="font-black">What formats does it cover?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Text, JSON, images, and PDF. Each tool indicates the formats it accepts and the operation it performs.</p></div><div className="surface-card p-5"><h2 className="font-black">Privacy</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">You do not need an account. Compatible operations run locally and files are not uploaded by default.</p></div></section>

    <section className="mt-10 rounded-2xl border border-border/70 bg-surface/55 p-5 sm:p-6"><h2 className="text-xl font-black">Frequently asked questions</h2><div className="mt-4 space-y-4 text-sm leading-6"><div><h3 className="font-bold">Are my documents uploaded?</h3><p className="text-muted-foreground">Compatible tools process files directly in the browser. Check each tool's privacy note before working with sensitive information.</p></div><div><h3 className="font-bold">Can I use the hub without signing up?</h3><p className="text-muted-foreground">Yes. The path is available without an account and you can save tools to favorites locally.</p></div></div></section>
  </main>;
}
