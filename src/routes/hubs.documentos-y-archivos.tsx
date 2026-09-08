import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileText, LockKeyhole } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { DOCUMENT_HUB, documentHubTools } from "@/lib/document-hub";
import { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, SITE_NAME } from "@/lib/seo";

const title = `${DOCUMENT_HUB.name}: herramientas online gratis | ${SITE_NAME}`;
const description = cleanDescription("Prepara, convierte y organiza documentos y archivos con herramientas online gratuitas. Procesamiento local, sin registro y con un recorrido paso a paso.");

export const Route = createFileRoute("/hubs/documentos-y-archivos")({
  loader: () => ({
    steps: documentHubTools(DOCUMENT_HUB.steps),
    alternatives: documentHubTools(DOCUMENT_HUB.alternatives),
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/hubs/documentos-y-archivos") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/hubs/documentos-y-archivos") }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", name: title, description, url: absoluteUrl("/hubs/documentos-y-archivos") },
          breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Hubs", path: "/hubs/documentos-y-archivos" }, { name: DOCUMENT_HUB.name }]),
          faqSchema([
            { q: "¿Se suben mis documentos a un servidor?", a: "Las herramientas compatibles procesan los archivos directamente en tu navegador. Revisa la indicación de privacidad de cada herramienta." },
            { q: "¿Qué puedo hacer con este hub?", a: "Puedes limpiar texto, comprobar su extensión, nombrar archivos, convertir imágenes, unir PDF, dividir documentos y extraer texto." },
            { q: "¿Necesito registrarme?", a: "No. El recorrido funciona sin cuenta ni registro." },
          ]),
        ],
      }),
    }],
  }),
  component: DocumentHubPage,
});

function DocumentHubPage() {
  const { steps, alternatives } = Route.useLoaderData();
  return <main className="container-page py-6 sm:py-8">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Documentos y archivos" }]} />
    <header className="hero-gradient mt-4 rounded-2xl border border-border/70 p-6 sm:p-9">
      <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-primary"><FileText className="size-6" /></span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{DOCUMENT_HUB.eyebrow}</p><h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">{DOCUMENT_HUB.name}</h1></div></div>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">{DOCUMENT_HUB.description}</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="size-4 text-primary" /> {DOCUMENT_HUB.outcome}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground"><span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5 text-primary" /> Sin registro</span><span>Procesamiento local cuando la herramienta lo permite</span><span>Exporta al terminar</span></div>
    </header>

    <section className="mt-9" aria-labelledby="document-hub-steps"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Recorrido recomendado</p><h2 id="document-hub-steps" className="mt-1 text-2xl font-black">Prepara tu documento en seis pasos</h2></div><Link to="/herramientas" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">Ver catálogo <ArrowRight className="size-4" /></Link></div><div className="mt-5 space-y-3">{steps.map((step, index) => <div key={step.slug} className="surface-card flex gap-4 p-4 sm:p-5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">{index + 1}</span><div className="min-w-0 flex-1"><p className="mb-2 text-sm font-bold text-primary">{step.title}</p><ToolCard tool={step.tool} /><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p><Link to={step.href as "/herramientas/$slug"} params={{ slug: step.tool.slug }} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">Abrir herramienta <ArrowRight className="size-4" /></Link></div></div>)}</div></section>

    <section className="mt-10" aria-labelledby="document-hub-alternatives"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Según el archivo</p><h2 id="document-hub-alternatives" className="mt-1 text-2xl font-black">Otras herramientas útiles</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{alternatives.map((tool) => <div key={tool.slug} className="surface-card p-4"><ToolCard tool={tool.tool} /><p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p><Link to={tool.href as "/herramientas/$slug"} params={{ slug: tool.tool.slug }} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">Abrir herramienta <ArrowRight className="size-4" /></Link></div>)}</div></section>

    <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Información del hub"><div className="surface-card p-5"><h2 className="font-black">¿Para quién es?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Freelancers, estudiantes, equipos y cualquier persona que necesite preparar archivos antes de enviarlos o publicarlos.</p></div><div className="surface-card p-5"><h2 className="font-black">¿Qué formatos cubre?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Texto, JSON, imágenes y PDF. Cada herramienta indica los formatos que acepta y la operación que realiza.</p></div><div className="surface-card p-5"><h2 className="font-black">Privacidad</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">No necesitas una cuenta. Las operaciones compatibles se ejecutan localmente y los archivos no se envían por defecto.</p></div></section>

    <section className="mt-10 rounded-2xl border border-border/70 bg-surface/55 p-5 sm:p-6"><h2 className="text-xl font-black">Preguntas frecuentes</h2><div className="mt-4 space-y-4 text-sm leading-6"><div><h3 className="font-bold">¿Se suben mis documentos?</h3><p className="text-muted-foreground">Las herramientas compatibles procesan los archivos directamente en el navegador. Comprueba el aviso de privacidad de cada herramienta antes de trabajar con información sensible.</p></div><div><h3 className="font-bold">¿Puedo usar el hub sin registrarme?</h3><p className="text-muted-foreground">Sí. El recorrido está disponible sin cuenta y puedes guardar herramientas en favoritos localmente.</p></div></div></section>
  </main>;
}
