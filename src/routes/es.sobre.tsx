import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/sobre")({
  head: () => ({
    meta: [
      { title: `Sobre | ${SITE_NAME}` },
      { name: "description", content: `Sobre ${SITE_NAME}: herramientas online gratis, calculadoras, convertidores, simuladores, juegos y recursos educativos. Sin cuenta. Operado desde Argentina. Contenido original enfocado en utilidades prácticas.` },
      { property: "og:title", content: `Sobre | ${SITE_NAME}` },
      { property: "og:description", content: `Herramientas online gratis y recursos educativos. Sin registro. Basado en el navegador. Propósito original: resolver problemas cotidianos con cálculo transparente y local.` },
      { property: "og:url", content: `${SITE_URL}/es/sobre` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/sobre` }],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Sobre" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Sobre {SITE_NAME}</h1>
        <p className="text-sm text-muted-foreground">Última actualización: 9 de noviembre de 2026</p>
        <p>
          {SITE_NAME} es una colección gratuita de herramientas online, calculadoras, convertidores, simuladores, juegos y recursos educativos.
          Todo funciona en tu navegador — sin cuenta, sin instalación y sin datos personales almacenados en nuestros servidores para las herramientas en sí.
          Nuestro objetivo es proporcionar utilidades prácticas y transparentes que ayuden con tareas cotidianas sin fricción.
        </p>
        <h2>Qué ofrecemos</h2>
        <p>
          Utilidades prácticas para tareas diarias: finanzas, texto, diseño, seguridad, educación, juegos y experiencias interactivas.
          Los resultados se calculan localmente o con fórmulas transparentes. Son informativos y educativos; no reemplazan el consejo profesional.
          Nos enfocamos en experiencias interactivas originales que van más allá de simples calculadoras, incluyendo kits, journeys, juegos clásicos y simuladores.
        </p>
        <h2>Cómo funciona</h2>
        <p>
          Abre cualquier herramienta, introduce tus datos y obtén un resultado instantáneo. Muchas herramientas soportan inglés y español. Los playgrounds interactivos,
          kits y juegos dan feedback visual inmediato y pueden exportarse o compartirse mediante PNG o enlaces profundos de URL.
          El sitio está diseñado para ser mobile-first y accesible.
        </p>
        <h2>Nuestro propósito</h2>
        <p>
          UtiliHub existe para hacer disponibles de forma gratuita herramientas digitales útiles y de alta calidad. Creemos en el cálculo basado en el navegador que respeta la privacidad del usuario,
          contenido original que resuelve problemas reales y una variedad de experiencias desde kits educativos hasta juegos clásicos. El contenido se crea y mantiene
          para ser sustantivo, no delgado, apoyando tanto a los usuarios como al cumplimiento futuro de monetización.
        </p>
        <h2>Densidad de contenido y originalidad</h2>
        <p>
          Todas las páginas y herramientas presentan contenido original y sustantivo. Evitamos páginas delgadas o duplicadas. Las experiencias educativas incluyen kits guiados, journeys paso a paso,
          juegos clásicos de dominio público con reglas claras y simuladores que modelan sistemas reales de causa y efecto. Esta densidad apoya un mejor valor para el usuario y el cumplimiento con políticas de redes publicitarias.
        </p>
        <h2>Cómo construimos</h2>
        <p>
          Las herramientas se eligen y desarrollan por su valor práctico cotidiano y profundidad educativa. Priorizamos el cálculo completamente local en el navegador, la accesibilidad, el soporte bilingüe (EN+ES) y resultados claros para el usuario. Las experiencias interactivas como kits, journeys, juegos clásicos y simuladores se diseñan con objetivos definidos, feedback de progreso y resultados compartibles. Todo el contenido es original de UtiliHub; no hacemos scraping ni duplicamos material externo.
        </p>
        <h2>Operador</h2>
        <p>
          El sitio es operado por un pequeño equipo con base en Argentina. Para preguntas, reportes de errores o sugerencias escribe a
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o usa la página de contacto.
        </p>
        <h2>Privacidad y anuncios</h2>
        <p>
          Las herramientas no requieren inicio de sesión. Podemos mostrar anuncios de terceros (incluyendo Adsterra y preparándonos para Google AdSense) para apoyar el servicio gratuito.
          Consulta nuestras páginas de Privacidad y Política de Cookies para detalles sobre cookies, redes publicitarias, opciones de exclusión y manejo de datos. No vendemos datos personales.
          Adsterra permanece completamente activo y sin cambios.
        </p>
        <p>
          Construido para resolver problemas, no para crearlos.
        </p>
      </article>
    </main>
  );
}
