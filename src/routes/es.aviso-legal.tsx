import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/aviso-legal")({
  head: () => ({
    meta: [
      { title: `Aviso legal | ${SITE_NAME}` },
      { name: "description", content: `Aviso legal, operador y condiciones de uso de ${SITE_NAME}.` },
      { property: "og:title", content: `Aviso legal | ${SITE_NAME}` },
      { property: "og:description", content: `Aviso legal, operador y condiciones de uso de ${SITE_NAME}.` },
      { property: "og:url", content: `${SITE_URL}/es/aviso-legal` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/aviso-legal` }],
  }),
  component: AvisoLegalPage,
});

function AvisoLegalPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Aviso legal" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Aviso legal</h1>
        <p>
          <strong>{SITE_NAME}</strong> ofrece herramientas y contenidos con fines informativos y educativos para un
          público internacional. La información no sustituye el asesoramiento profesional ni las decisiones tomadas
          bajo criterio individual.
        </p>
        <h2>Operador del sitio</h2>
        <p>
          Nuestro equipo opera {SITE_NAME} y está basado en Argentina. Para consultas relacionadas con el sitio
          puedes escribir a <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o llamar al{" "}
          <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.
        </p>
        <p>
          El sitio está dirigido a usuarios de distintos países. No se publica una dirección residencial; las
          comunicaciones se reciben a través de los canales indicados.
        </p>
        <h2>Finalidad</h2>
        <p>
          {SITE_NAME} ofrece calculadoras, convertidores, utilidades educativas y recursos prácticos para facilitar
          tareas cotidianas y apoyar la comprensión de diversos conceptos.
        </p>
        <p>
          Los resultados se basan en los parámetros introducidos por el usuario y en supuestos de simulación. No
          constituyen recomendaciones de inversión, asesoramiento financiero, médico, legal ni profesional
          personalizado.
        </p>
        <h2>Uso y responsabilidad</h2>
        <p>
          El usuario utiliza las herramientas bajo su propia responsabilidad y debe valorar la idoneidad de los
          resultados antes de tomar decisiones económicas, financieras o de cualquier otra índole significativa.
        </p>
        <p>
          En la medida permitida por la legislación aplicable, el operador no será responsable de daños directos,
          indirectos, incidentales o consecuentes derivados del uso de las herramientas o de la interpretación de
          sus resultados.
        </p>
        <h2>Disponibilidad y terceros</h2>
        <p>
          No se garantiza que todas las herramientas estén libres de errores, disponibles en todo momento o
          adaptadas a las leyes de cada país. El sitio puede incluir dependencias técnicas y recursos de terceros,
          cuyos proveedores mantienen sus propios términos y políticas.
        </p>
      </article>
    </main>
  );
}
