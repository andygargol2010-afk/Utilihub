import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({ meta: [{ title: `Aviso legal | ${SITE_NAME}` }, { name: "description", content: `Aviso legal, responsable y condiciones de uso de ${SITE_NAME}.` }], links: [{ rel: "canonical", href: `${SITE_URL}/aviso-legal` }] }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return <main className="container-page py-8 sm:py-12"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Aviso legal" }]} /><article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
    <h1>Aviso legal</h1>
    <p><strong>{SITE_NAME}</strong> ofrece herramientas y contenidos con carácter informativo y educativo para un público internacional. La información no sustituye la asesoría profesional ni la toma de decisiones bajo criterio individual.</p>
    <h2>Responsable del sitio</h2>
    <p>El responsable de {SITE_NAME} es <strong>Andrés García</strong>, con residencia en Argentina. Para consultas relacionadas con el sitio puedes escribir a <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o comunicarte al <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.</p>
    <p>El sitio está dirigido a usuarios de distintos países. No se publica una dirección residencial; las comunicaciones se reciben a través de los canales indicados.</p>
    <h2>Objeto y finalidad</h2>
    <p>{SITE_NAME} ofrece calculadoras, conversores, utilidades educativas y recursos prácticos para facilitar tareas cotidianas y la comprensión de distintos conceptos.</p>
    <p>Los resultados se basan en los parámetros introducidos por el usuario y en supuestos de simulación. No constituyen recomendación de inversión, asesoramiento financiero, médico, legal ni profesional personalizado.</p>
    <h2>Uso y responsabilidad</h2>
    <p>El usuario utiliza las herramientas bajo su propia responsabilidad y debe evaluar la idoneidad de los resultados antes de tomar decisiones económicas, patrimoniales o de cualquier otra naturaleza relevante.</p>
    <p>En la medida permitida por la normativa aplicable, el responsable no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso de las herramientas o de la interpretación de sus resultados.</p>
    <h2>Disponibilidad y terceros</h2>
    <p>No se garantiza que todas las herramientas estén libres de errores, disponibles en todo momento o adaptadas a la legislación de cada país. El sitio puede incluir dependencias y recursos técnicos de terceros, cuyos proveedores mantienen sus propios términos y políticas.</p>
  </article></main>;
}
