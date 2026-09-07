import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [{ title: `Privacidad | ${SITE_NAME}` }, { name: "description", content: `Política de privacidad de ${SITE_NAME}.` }],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacidad` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <main className="container-page py-8 sm:py-12">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Privacidad" }]} />
    <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
      <h1>Privacidad</h1>
      <p>En <strong>{SITE_NAME}</strong>, la mayoría de las herramientas procesa los datos directamente en tu navegador. No necesitas crear una cuenta para utilizarlas.</p>
      <h2>Datos introducidos en las herramientas</h2>
      <p>Los datos que escribes en calculadoras, conversores y utilidades locales permanecen en tu navegador mientras utilizas la herramienta, salvo que el propio navegador o una función que elijas explícitamente los almacene localmente.</p>
      <h2>Preferencias locales</h2>
      <p>Algunas funciones, como favoritos, herramientas recientes o la racha de uso, pueden guardarse en el almacenamiento local de tu navegador para mejorar la experiencia.</p>
      <h2>Métricas técnicas</h2>
      <p>El sitio puede utilizar servicios de analítica y rendimiento para conocer el uso agregado y mejorar la estabilidad. Estos servicios pueden recibir información técnica de la visita conforme a sus propias políticas.</p>
      <h2>Actualizaciones</h2>
      <p>Esta página puede actualizarse cuando cambien las funciones del sitio o los servicios utilizados.</p>
    </article>
  </main>;
}
