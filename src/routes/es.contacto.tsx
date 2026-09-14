import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/contacto")({
  head: () => ({
    meta: [
      { title: `Contacto | ${SITE_NAME}` },
      { name: "description", content: `Información de contacto y soporte de ${SITE_NAME}.` },
      { property: "og:title", content: `Contacto | ${SITE_NAME}` },
      { property: "og:description", content: `Información de contacto y soporte de ${SITE_NAME}.` },
      { property: "og:url", content: `${SITE_URL}/es/contacto` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/contacto` }],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Contacto" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Contacto</h1>
        <p>
          Si necesitas preguntar cómo funciona {SITE_NAME}, reportar un error, sugerir una mejora o plantear una
          cuestión legal o de privacidad, puedes contactarnos por estos canales.
        </p>
        <h2>Canales de contacto</h2>
        <ul>
          <li>
            Correo: <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a>
          </li>
          <li>
            Teléfono: <a href="tel:+5491162517976">+54 9 11 6251-7976</a>
          </li>
          <li>
            Informes técnicos:{" "}
            <a href="https://github.com/andygargol2010-afk/Utilihub/issues" target="_blank" rel="noreferrer">
              Issues del repositorio en GitHub
            </a>
          </li>
        </ul>
        <p>
          Nuestro equipo está basado en Argentina y atiende consultas de usuarios internacionales a través de los
          canales anteriores.
        </p>
        <h2>Qué incluir en un informe</h2>
        <p>
          Indica la herramienta o URL afectada, los pasos para reproducir el problema, el resultado esperado y el
          resultado real. No incluyas contraseñas, datos financieros, documentos de identidad ni otra información
          confidencial.
        </p>
      </article>
    </main>
  );
}
