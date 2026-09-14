import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, FileText, LockKeyhole } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { DOCUMENT_HUB, documentHubTools } from "@/lib/document-hub";
import { spanishToolPath } from "@/lib/i18n/es";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const title = "Documentos y archivos: herramientas gratis | UtiliHub";
const description = cleanDescription(
  "Prepará, convertí y organizá documentos y archivos con herramientas online gratuitas. Procesamiento local, sin registro.",
);

export const Route = createFileRoute("/es/hubs/documentos-y-archivos")({
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
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/hubs/documentos-y-archivos") },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/hubs/documentos-y-archivos") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/hubs/documentos-y-archivos") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/hubs/documents-and-files") },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "CollectionPage", name: title, description, url: absoluteUrl("/es/hubs/documentos-y-archivos") },
          breadcrumbSchema([{ name: "Inicio", path: "/es" }, { name: "Documentos y archivos" }]),
        ],
      }),
    }],
  }),
  component: SpanishDocumentHubPage,
});

function SpanishDocumentHubPage() {
  const { steps, alternatives } = Route.useLoaderData();
  return (
    <main className="container-page py-6 sm:py-8">
      <Breadcrumbs locale="es" items={[{ label: "Inicio", to: "/es" }, { label: "Documentos y archivos" }]} />
      <header className="hero-gradient mt-4 rounded-2xl border border-border/70 p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Prepará, convertí y entregá</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Documentos y archivos sin complicaciones</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Un camino práctico para limpiar contenido, preparar archivos y convertir documentos sin subirlos a un servidor.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[.14em] text-primary">
          <span className="inline-flex items-center gap-1.5"><FileText className="size-3.5" /> Sin registro</span>
          <span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5" /> Privacidad local</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> En el navegador</span>
        </div>
      </header>

      <section className="mt-10" aria-labelledby="doc-steps">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Camino recomendado</p>
        <h2 id="doc-steps" className="mt-1 text-2xl font-black">Pasos para preparar tu archivo</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {steps.map((step) => {
            const href = spanishToolPath(step.tool);
            return (
              <div key={step.slug} className="surface-card p-4">
                <ToolCard tool={step.tool} locale="es" />
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.descriptionEs}</p>
                <Link to={href as never} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Abrir herramienta <ArrowRight className="size-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="doc-alt">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Por tipo de archivo</p>
        <h2 id="doc-alt" className="mt-1 text-2xl font-black">Otras herramientas útiles</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {alternatives.map((step) => {
            const href = spanishToolPath(step.tool);
            return (
              <div key={step.slug} className="surface-card p-4">
                <ToolCard tool={step.tool} locale="es" />
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.descriptionEs}</p>
                <Link to={href as never} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Abrir herramienta <ArrowRight className="size-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Información del hub">
        <div className="surface-card p-5">
          <h2 className="font-black">¿Para quién es?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Freelancers, estudiantes, equipos y cualquiera que necesite preparar archivos antes de enviarlos.</p>
        </div>
        <div className="surface-card p-5">
          <h2 className="font-black">¿Qué formatos cubre?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Texto, JSON, imágenes y PDF. Cada herramienta indica los formatos que acepta.</p>
        </div>
        <div className="surface-card p-5">
          <h2 className="font-black">Privacidad</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">No necesitás cuenta. Las operaciones compatibles corren en local y los archivos no se suben por defecto.</p>
        </div>
      </section>
    </main>
  );
}
