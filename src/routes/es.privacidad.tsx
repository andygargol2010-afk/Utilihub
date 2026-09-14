import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/privacidad")({
  head: () => ({
    meta: [
      { title: `Política de privacidad | ${SITE_NAME}` },
      { name: "description", content: `Política de privacidad y tratamiento de datos de ${SITE_NAME}.` },
      { property: "og:locale", content: "es_ES" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/es/privacidad` },
      { rel: "alternate", hrefLang: "es", href: `${SITE_URL}/es/privacidad` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/privacy` },
    ],
  }),
  component: SpanishPrivacyPage,
});

function SpanishPrivacyPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs locale="es" items={[{ label: "Inicio", to: "/es" }, { label: "Privacidad" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Política de privacidad</h1>
        <p>Esta política explica cómo <strong>{SITE_NAME}</strong> trata la información que puede recopilarse al navegar o usar el sitio. {SITE_NAME} está orientado a una audiencia internacional y su operador está basado en Argentina.</p>
        <h2>Información que podemos procesar</h2>
        <p>Podemos procesar datos técnicos básicos de navegación, como tipo de navegador, sistema operativo, idioma, páginas visitadas, duración de la sesión, dirección IP y datos de seguridad del sitio, con fines estadísticos, de mantenimiento técnico y de protección frente a errores o abusos.</p>
        <p>Las calculadoras, conversores y utilidades compatibles procesan los valores que ingresás de forma local en el navegador. No requerimos cuentas, contraseñas ni información financiera personal para usar las herramientas.</p>
        <h2>Preferencias locales</h2>
        <p>Algunas funciones, como favoritos, herramientas recientes o preferencias de uso, pueden guardarse en el almacenamiento local de tu navegador para mejorar la experiencia. Podés eliminarlas desde la configuración del navegador.</p>
        <h2>Analítica y rendimiento</h2>
        <p>UtiliHub puede usar <strong>Vercel Analytics</strong> y <strong>Vercel Speed Insights</strong> para entender el uso agregado y las métricas de rendimiento, detectar problemas técnicos y mejorar la estabilidad. Estos proveedores pueden procesar información técnica de las visitas según sus propias políticas.</p>
        <h2>Uso de la información</h2>
        <p>La información se usa para mejorar la experiencia, mantener la seguridad, analizar el comportamiento general del sitio y optimizar la entrega de contenido. No vendemos datos personales ni los compartimos de formas contrarias a la ley aplicable, salvo obligación legal, contractual o consentimiento expreso cuando corresponda.</p>
        <h2>Derechos y consultas</h2>
        <p>Para consultar, corregir o solicitar información sobre el tratamiento de datos, podés escribir a <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o llamar al <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.</p>
        <h2>Actualizaciones</h2>
        <p>Esta política puede actualizarse cuando cambien las funciones del sitio, los servicios utilizados o la normativa aplicable.</p>
      </article>
    </main>
  );
}
