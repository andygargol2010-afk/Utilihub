import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/acerca")({
  head: () => ({
    meta: [
      { title: `Acerca de | ${SITE_NAME}` },
      { name: "description", content: `Acerca de ${SITE_NAME}: herramientas online gratuitas, calculadoras, convertidores y recursos educativos. Sin cuenta. Operado desde Argentina.` },
      { property: "og:title", content: `Acerca de | ${SITE_NAME}` },
      { property: "og:description", content: `Herramientas gratuitas y recursos educativos. Sin registro. En el navegador.` },
      { property: "og:url", content: `${SITE_URL}/es/acerca` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/acerca` }],
  }),
  component: AcercaPage,
});

function AcercaPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Acerca de" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Acerca de {SITE_NAME}</h1>
        <p>
          {SITE_NAME} es una colección gratuita de herramientas online, calculadoras, convertidores, simuladores y recursos educativos.
          Todo funciona en el navegador: sin cuenta, sin instalación y sin almacenar datos personales en nuestros servidores para las herramientas.
        </p>
        <h2>Qué ofrecemos</h2>
        <p>
          Utilidades prácticas para tareas cotidianas: finanzas, texto, diseño, seguridad, educación, juegos y experiencias interactivas.
          Los resultados se calculan localmente o con fórmulas transparentes. Son informativos y educativos; no reemplazan el consejo profesional.
        </p>
        <h2>Cómo funciona</h2>
        <p>
          Abre cualquier herramienta, ingresa tus datos y obtén un resultado instantáneo. Muchas herramientas tienen versión en español e inglés.
          Los playgrounds interactivos (mandalas, partículas, firmas, etc.) dan retroalimentación visual inmediata y permiten exportar o compartir.
        </p>
        <h2>Operador</h2>
        <p>
          El sitio es operado por un equipo pequeño con base en Argentina. Para preguntas, reportes de errores o sugerencias escribe a
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o usa la página de contacto.
        </p>
        <h2>Privacidad y anuncios</h2>
        <p>
          Las herramientas no requieren inicio de sesión. Podemos mostrar anuncios de terceros (incluido Adsterra) para mantener el servicio gratuito.
          Consulta nuestra página de Privacidad para detalles sobre cookies y opciones de opt-out. No vendemos datos personales.
        </p>
        <p>
          Creado para resolver problemas, no para crearlos.
        </p>
      </article>
    </main>
  );
}
