import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [{ title: `Aviso legal | ${SITE_NAME}` }, { name: "description", content: `Información legal de ${SITE_NAME}.` }],
    links: [{ rel: "canonical", href: `${SITE_URL}/aviso-legal` }],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return <main className="container-page py-8 sm:py-12">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Aviso legal" }]} />
    <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
      <h1>Aviso legal</h1>
      <p><strong>{SITE_NAME}</strong> es un sitio web de utilidades gratuitas que funciona principalmente en el navegador. Sus herramientas ofrecen resultados orientativos y no sustituyen asesoramiento profesional.</p>
      <h2>Uso del sitio</h2>
      <p>El usuario utiliza las herramientas bajo su propia responsabilidad. Antes de tomar decisiones financieras, médicas, legales o de cualquier otra naturaleza relevante, debe contrastar los resultados con una fuente profesional adecuada.</p>
      <h2>Disponibilidad</h2>
      <p>Intentamos mantener el servicio disponible y actualizado, pero no garantizamos que todas las herramientas estén libres de errores o disponibles en todo momento.</p>
      <h2>Contenido de terceros</h2>
      <p>El sitio puede incluir dependencias y recursos técnicos de terceros. Cada proveedor mantiene sus propios términos y políticas.</p>
    </article>
  </main>;
}
