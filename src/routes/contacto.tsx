import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [{ title: `Contacto | ${SITE_NAME}` }, { name: "description", content: `Información de contacto y soporte de ${SITE_NAME}.` }],
    links: [{ rel: "canonical", href: `${SITE_URL}/contacto` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return <main className="container-page py-8 sm:py-12">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]} />
    <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
      <h1>Contacto</h1>
      <p>¿Encontraste un error o tienes una sugerencia para mejorar {SITE_NAME}? Puedes abrir una incidencia o propuesta en el repositorio público del proyecto.</p>
      <p><a href="https://github.com/andygargol2010-afk/Utilihub/issues" target="_blank" rel="noreferrer">Abrir contacto y reportar un problema en GitHub</a></p>
      <h2>Qué incluir en un reporte</h2>
      <p>Indica la herramienta o URL afectada, los pasos para reproducir el problema, el resultado esperado y el resultado obtenido. No incluyas datos personales ni información confidencial.</p>
    </article>
  </main>;
}
