import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [{ title: `Contacto | ${SITE_NAME}` }, { name: "description", content: `Información de contacto y soporte de ${SITE_NAME}.` }], links: [{ rel: "canonical", href: `${SITE_URL}/contacto` }] }),
  component: ContactPage,
});

function ContactPage() {
  return <main className="container-page py-8 sm:py-12"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]} /><article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
    <h1>Contacto</h1>
    <p>Si necesitas consultar cualquier aspecto sobre el funcionamiento de {SITE_NAME}, informar un error, sugerir una mejora o plantear una cuestión legal o de privacidad, puedes comunicarte a través de estos canales.</p>
    <h2>Canales de comunicación</h2>
    <ul><li>Correo electrónico: <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a></li><li>Teléfono: <a href="tel:+5491162517976">+54 9 11 6251-7976</a></li><li>Reportes técnicos: <a href="https://github.com/andygargol2010-afk/Utilihub/issues" target="_blank" rel="noreferrer">issues del repositorio en GitHub</a></li></ul>
    <p>El responsable del sitio, <strong>Andrés García</strong>, reside en Argentina y atiende consultas de usuarios internacionales a través de los canales indicados.</p>
    <h2>Qué incluir en un reporte</h2>
    <p>Indica la herramienta o URL afectada, los pasos para reproducir el problema, el resultado esperado y el resultado obtenido. No incluyas contraseñas, datos financieros, documentos de identidad ni otra información confidencial.</p>
  </article></main>;
}
