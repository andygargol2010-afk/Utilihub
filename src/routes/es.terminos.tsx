import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/terminos")({
  head: () => ({
    meta: [
      { title: `Términos de Uso | ${SITE_NAME}` },
      { name: "description", content: `Términos de Uso de ${SITE_NAME}: uso aceptable, responsabilidad, anuncios, propiedad intelectual y contacto.` },
      { property: "og:title", content: `Términos de Uso | ${SITE_NAME}` },
      { property: "og:description", content: `Uso aceptable, responsabilidad, anuncios y propiedad intelectual de ${SITE_NAME}.` },
      { property: "og:url", content: absoluteUrl("/es/terminos") },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/es/terminos` },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/terms") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/terminos") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/terms") },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  return (
    <main className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Términos de Uso" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Términos de Uso</h1>
        <p>
          Estos Términos de Uso regulan el acceso y uso de <strong>{SITE_NAME}</strong>, incluidas todas las herramientas,
          calculadoras, experiencias interactivas, contenidos y servicios. Al utilizar el sitio aceptas estos términos.
          El operador tiene base en Argentina y el sitio se ofrece a un público internacional.
        </p>

        <h2>Uso aceptable</h2>
        <p>
          Puedes utilizar las herramientas y contenidos con fines personales, educativos y no comerciales. Te comprometes a no:
        </p>
        <ul>
          <li>Usar el sitio de forma que viole la legislación aplicable o los derechos de terceros;</li>
          <li>Intentar interrumpir, sobrecargar, realizar ingeniería inversa o interferir con el funcionamiento del sitio o sus herramientas;</li>
          <li>Realizar scraping, crawling o extracción sistemática de contenidos en volúmenes que perjudiquen el servicio a otros usuarios;</li>
          <li>Cargar o transmitir código malicioso, spam o contenidos ilícitos, difamatorios o que infrinjan derechos.</li>
        </ul>
        <p>
          Los resultados de calculadoras y simuladores son informativos y educativos. No constituyen asesoramiento profesional,
          financiero, legal, médico ni de otro tipo especializado. Verifica siempre las decisiones importantes con un profesional cualificado.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          El diseño del sitio, la marca, los textos originales, las ilustraciones y el software son propiedad del operador o de sus licenciantes
          y están protegidos por las leyes de propiedad intelectual aplicables. No puedes copiar, modificar, distribuir ni crear
          obras derivadas de los materiales propietarios del sitio sin autorización previa por escrito, salvo el uso personal o educativo
          limitado de los resultados individuales de las herramientas.
        </p>
        <p>
          Las marcas, logotipos y contenidos de terceros siguen siendo propiedad de sus respectivos titulares.
        </p>

        <h2>Anuncios</h2>
        <p>
          Para mantener {SITE_NAME} gratuito, podemos mostrar anuncios de terceros, incluidos los de <strong>Adsterra</strong>
          y otras redes. Estos anuncios son proporcionados por terceros independientes. No controlamos su contenido ni somos
          responsables de los productos, servicios o afirmaciones publicitadas. Tu interacción con los anunciantes es exclusivamente
          entre tú y el anunciante. Consulta nuestra Política de Privacidad para información sobre cookies y tecnologías de seguimiento
          utilizadas por los socios publicitarios.
        </p>

        <h2>Exención de garantías</h2>
        <p>
          El sitio y todas las herramientas se proporcionan "tal cual" y "según disponibilidad" sin garantías de ningún tipo, expresas
          o implícitas, incluidas, entre otras, las garantías de comerciabilidad, idoneidad para un fin particular, exactitud o no infracción.
          No garantizamos que el sitio sea ininterrumpido, libre de errores o libre de virus u otros componentes dañinos.
        </p>

        <h2>Limitación de responsabilidad</h2>
        <p>
          En la máxima medida permitida por la legislación aplicable, el operador, sus colaboradores y afiliados no serán responsables de
          ningún daño directo, indirecto, incidental, especial, consecuente o punitivo que surja de o esté relacionado con el uso (o la
          imposibilidad de uso) del sitio, las herramientas o los contenidos, incluso si se ha advertido de la posibilidad de dichos daños.
          Esto incluye daños por pérdida de beneficios, datos, buena voluntad u otras pérdidas intangibles.
        </p>

        <h2>Cambios en estos términos</h2>
        <p>
          Podemos actualizar estos Términos de Uso ocasionalmente. El uso continuado del sitio después de la publicación de cambios
          constituye la aceptación de los términos revisados. La fecha de la última revisión se indicará cuando se realicen cambios materiales.
        </p>

        <h2>Contacto</h2>
        <p>
          Para preguntas sobre estos términos, contáctanos en{" "}
          <a href="mailto:andygargol2010@gmail.com">andygargol2010@gmail.com</a> o visita la página de Contacto.
        </p>
      </article>
    </main>
  );
}
