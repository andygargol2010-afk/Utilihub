import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/privacidad")({
  head: () => ({ meta: [{ title: `Política de privacidad | ${SITE_NAME}` }, { name: "description", content: `Política de privacidad y tratamiento de datos de ${SITE_NAME}.` }], links: [{ rel: "canonical", href: `${SITE_URL}/privacidad` }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <main className="container-page py-8 sm:py-12"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Privacidad" }]} /><article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
    <h1>Política de privacidad</h1>
    <p>Esta política informa sobre la forma en que <strong>{SITE_NAME}</strong> gestiona la información que puede recopilarse al navegar o utilizar el sitio. {SITE_NAME} está dirigido a un público internacional y su responsable reside en Argentina.</p>
    <h2>Información que podemos tratar</h2>
    <p>Podemos tratar datos técnicos básicos de navegación, como el tipo de navegador, sistema operativo, idioma, páginas visitadas, duración de la sesión, dirección IP y datos de seguridad del sitio, con fines estadísticos, de mantenimiento técnico y de protección frente a errores o abusos.</p>
    <p>Las calculadoras, conversores y utilidades compatibles procesan los valores introducidos localmente en el navegador. No solicitamos cuentas, contraseñas ni información financiera personal para utilizar las herramientas.</p>
    <h2>Preferencias locales</h2>
    <p>Algunas funciones, como favoritos, herramientas recientes o preferencias de uso, pueden guardarse en el almacenamiento local de tu navegador para mejorar la experiencia. Puedes eliminarlos desde la configuración del navegador.</p>
    <h2>Analítica y rendimiento</h2>
    <p>UtiliHub puede utilizar <strong>Vercel Analytics</strong> y <strong>Vercel Speed Insights</strong> para conocer métricas agregadas de uso y rendimiento, detectar problemas técnicos y mejorar la estabilidad. Estos proveedores pueden tratar información técnica de la visita conforme a sus propias políticas.</p>
    <h2>Uso de la información</h2>
    <p>La información se utiliza para mejorar la experiencia, mantener la seguridad, analizar el comportamiento general del sitio y optimizar la entrega de contenido. No vendemos datos personales ni los compartimos en condiciones contrarias a la normativa aplicable, salvo que exista un requerimiento legal, una obligación contractual o el consentimiento expreso cuando corresponda.</p>
    <h2>Derechos y consultas</h2>
    <p>Para consultar, corregir o solicitar información sobre el tratamiento de datos, puedes escribir a <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o comunicarte al <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.</p>
    <h2>Actualizaciones</h2>
    <p>Esta política puede actualizarse cuando cambien las funciones del sitio, los servicios utilizados o la normativa aplicable.</p>
  </article></main>;
}
