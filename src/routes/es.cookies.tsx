import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/cookies")({
  head: () => ({
    meta: [
      { title: `Política de Cookies | ${SITE_NAME}` },
      { name: "description", content: `Política de Cookies de ${SITE_NAME}: analítica, cookies publicitarias (incluyendo Adsterra y posibles socios de Google), almacenamiento local, métodos de exclusión, procesadores de terceros y retención.` },
      { property: "og:title", content: `Política de Cookies | ${SITE_NAME}` },
      { property: "og:description", content: `Cómo ${SITE_NAME} utiliza cookies y tecnologías similares.` },
      { property: "og:url", content: absoluteUrl("/es/cookies") },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/es/cookies` },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/cookies") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/cookies") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/cookies") },
    ],
  }),
  component: CookiesPageEs,
});

function CookiesPageEs() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Política de Cookies" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Política de Cookies</h1>
        <p className="text-sm text-muted-foreground">Última actualización: 9 de noviembre de 2026</p>
        <p>
          Esta Política de Cookies explica cómo <strong>{SITE_NAME}</strong> utiliza cookies y tecnologías similares (como
          el almacenamiento local) cuando visitas el sitio. Complementa nuestra <a href="/es/privacidad">Política de Privacidad</a>. El
          operador tiene base en Argentina y el sitio se dirige a un público internacional.
        </p>
        <h2>Puntos clave</h2>
        <ul>
          <li>Cookies de analítica de Vercel para insights de rendimiento agregados.</li>
          <li>Cookies publicitarias de Adsterra y potencialmente Google AdSense para entrega y medición.</li>
          <li>Almacenamiento local para preferencias que permanecen en tu dispositivo.</li>
          <li>Opciones de exclusión sencillas mediante navegador o herramientas de preferencias del sector.</li>
        </ul>

        <h2>¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo. Ayudan a recordar
          preferencias, comprender el uso y ofrecer contenido o publicidad relevante. También usamos el almacenamiento local
          del navegador para ciertas preferencias que no salen de tu dispositivo.
        </p>

        <h2>Cookies y tecnologías que utilizamos</h2>
        <h3>Analítica (Vercel)</h3>
        <p>
          Utilizamos <strong>Vercel Analytics</strong> y <strong>Vercel Speed Insights</strong> para recopilar información
          agregada y anonimizada sobre cómo los visitantes usan el sitio (páginas vistas, métricas de rendimiento, patrones
          generales de tráfico). Esto nos ayuda a mejorar la velocidad, la estabilidad y el contenido. Vercel procesa estos
          datos técnicos bajo su propia política de privacidad.
        </p>

        <h3>Publicidad (Adsterra y socios, incluyendo posible Google AdSense)</h3>
        <p>
          Para mantener {SITE_NAME} gratuito, mostramos anuncios de <strong>Adsterra</strong> y sus socios publicitarios.
          Estos socios pueden establecer cookies o usar tecnologías similares para entregar y medir anuncios, prevenir fraude
          y (cuando esté permitido) personalizar la publicidad. No controlamos las cookies establecidas por estos terceros. Su
          uso se rige por sus propias políticas.
        </p>
        <p>
          También podemos trabajar con redes publicitarias adicionales como Google AdSense. Los proveedores de terceros, incluyendo Google, usan cookies para servir anuncios basados en visitas previas del usuario a este sitio web u otros sitios. El uso de la cookie publicitaria por parte de Google permite a él y a sus socios servir anuncios a los usuarios basándose en su visita a este sitio y/o a otros sitios en Internet. Los usuarios pueden excluirse del uso de la cookie publicitaria para publicidad basada en intereses visitando <a href="https://adssettings.google.com">Google Ad Settings</a> o <a href="https://aboutads.info">aboutads.info</a>.
        </p>

        <h3>Preferencias de almacenamiento local</h3>
        <p>
          Ciertas funciones almacenan datos solo en el almacenamiento local de tu navegador, como herramientas favoritas,
          herramientas recientes, preferencias de interfaz y (si aplica) elecciones de consentimiento de cookies. Estos datos
          permanecen en tu dispositivo y no se envían a nuestros servidores. Puedes eliminarlos en cualquier momento desde la
          configuración de tu navegador.
        </p>

        <h2>Métodos de exclusión y control</h2>
        <ul>
          <li>
            <strong>Configuración del navegador:</strong> La mayoría de los navegadores permiten bloquear o eliminar cookies.
            Consulta la sección de ayuda de tu navegador. Bloquear todas las cookies puede afectar la funcionalidad del sitio.
          </li>
          <li>
            <strong>Preferencias de publicidad:</strong> Puedes gestionar la publicidad basada en intereses a través de
            herramientas del sector como la Digital Advertising Alliance (DAA), <a href="https://adssettings.google.com">Google Ad Settings</a>, <a href="https://optout.networkadvertising.org">Network Advertising Initiative</a> o <a href="https://aboutads.info">aboutads.info</a>, o usando un bloqueador
            de anuncios.
          </li>
          <li>
            <strong>Almacenamiento local:</strong> Borra los datos del sitio o el almacenamiento local de este dominio en la
            configuración del navegador para eliminar preferencias almacenadas.
          </li>
          <li>
            Ten en cuenta que algunas tecnologías publicitarias pueden seguir funcionando basándose en otras señales incluso si
            las cookies están restringidas. No eliminamos ni desactivamos la publicidad de Adsterra.
          </li>
        </ul>

        <h2>Procesadores de terceros</h2>
        <p>
          Los principales terceros que pueden procesar datos técnicos o publicitarios incluyen:
        </p>
        <ul>
          <li><strong>Vercel</strong> — alojamiento, analítica e información de rendimiento.</li>
          <li><strong>Adsterra</strong> y sus socios publicitarios — entrega y medición de anuncios.</li>
          <li>Posibles socios adicionales como Google (AdSense) — entrega y personalización de anuncios (cuando esté habilitado).</li>
        </ul>
        <p>
          Recomendamos revisar sus políticas de privacidad para más detalles. No vendemos información personal. Los datos de estos procesadores se conservan según sus políticas y nuestros intereses legítimos (normalmente a corto plazo o agregados).
        </p>

        <h2>Preparación para redes publicitarias</h2>
        <p>
          Las divulgaciones de cookies están preparadas para apoyar requisitos comunes de redes publicitarias sobre transparencia en cookies de terceros y exclusiones. Adsterra permanece completamente activo y sin cambios. Consulta /ads.txt para entradas de autorización placeholder durante la preparación.
        </p>

        <h2>Actualizaciones</h2>
        <p>
          Podemos actualizar esta Política de Cookies cuando cambie nuestro uso de cookies o los servicios de terceros. La
          fecha anterior refleja la última revisión.
        </p>

        <h2>Contacto</h2>
        <p>
          ¿Preguntas sobre esta política? Escribe a{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o visita la página de Contacto.
        </p>
      </article>
    </main>
  );
}
