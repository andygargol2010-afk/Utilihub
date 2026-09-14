import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/privacidad")({
  head: () => ({
    meta: [
      { title: `Política de privacidad | ${SITE_NAME}` },
      { name: "description", content: `Política de privacidad y tratamiento de datos de ${SITE_NAME}.` },
      { property: "og:title", content: `Política de privacidad | ${SITE_NAME}` },
      { property: "og:description", content: `Política de privacidad y tratamiento de datos de ${SITE_NAME}.` },
      { property: "og:url", content: `${SITE_URL}/es/privacidad` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/privacidad` }],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Privacidad" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Política de privacidad</h1>
        <p>
          Esta política explica cómo <strong>{SITE_NAME}</strong> trata la información que puede recopilarse al
          navegar o usar el sitio. {SITE_NAME} está dirigido a un público internacional y su operador está basado
          en Argentina.
        </p>
        <h2>Información que podemos tratar</h2>
        <p>
          Podemos tratar datos técnicos básicos de navegación, como tipo de navegador, sistema operativo, idioma,
          páginas visitadas, duración de la sesión, dirección IP y datos de seguridad del sitio, con fines de
          estadísticas, mantenimiento técnico y protección frente a errores o abusos.
        </p>
        <p>
          Las calculadoras, convertidores y utilidades compatibles procesan los valores que introduces de forma
          local en el navegador. No exigimos cuentas, contraseñas ni información financiera personal para usar las
          herramientas.
        </p>
        <h2>Preferencias locales</h2>
        <p>
          Algunas funciones, como favoritos, herramientas recientes o preferencias de uso, pueden almacenarse en el
          almacenamiento local de tu navegador para mejorar la experiencia. Puedes eliminarlas desde la
          configuración del navegador.
        </p>
        <h2>Analítica y rendimiento</h2>
        <p>
          UtiliHub puede usar <strong>Vercel Analytics</strong> y <strong>Vercel Speed Insights</strong> para
          comprender el uso agregado y las métricas de rendimiento, detectar problemas técnicos y mejorar la
          estabilidad. Estos proveedores pueden tratar información técnica de las visitas bajo sus propias
          políticas.
        </p>
        <h2>Uso de la información</h2>
        <p>
          La información se utiliza para mejorar la experiencia, mantener la seguridad, analizar el comportamiento
          general del sitio y optimizar la entrega de contenidos. No vendemos datos personales ni los compartimos de
          forma contraria a la legislación aplicable, salvo que exista un requisito legal, una obligación
          contractual o un consentimiento expreso cuando proceda.
        </p>
        <h2>Derechos y consultas</h2>
        <p>
          Para consultar, corregir o solicitar información sobre el tratamiento de datos, puedes escribir a{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o llamar al{" "}
          <a href="tel:+5491162517976">+54 9 11 6251-7976</a>.
        </p>
        <h2>Actualizaciones</h2>
        <p>
          Esta política puede actualizarse cuando cambien las funcionalidades del sitio, los servicios utilizados o
          la normativa aplicable.
        </p>
      </article>
    </main>
  );
}
