import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad · UtiliHub" },
      {
        name: "description",
        content:
          "Política de privacidad de UtiliHub: información sobre datos, almacenamiento local, analítica y publicidad.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="container-page max-w-3xl py-12 md:py-16">
      <Link to="/" className="text-sm font-semibold text-primary hover:underline">
        ← Volver a UtiliHub
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
        Política de privacidad
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Última actualización: 25 de agosto de 2026
      </p>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
        <h2>1. Información general</h2>
        <p>
          UtiliHub es una plataforma de herramientas web que busca funcionar sin
          registro de usuario. Esta política explica qué información puede
          procesarse cuando utilizas el sitio y cómo se utilizan los servicios de
          terceros integrados en él.
        </p>

        <h2>2. Datos introducidos en las herramientas</h2>
        <p>
          Las herramientas de UtiliHub están diseñadas para realizar cálculos y
          transformaciones directamente en el navegador. No debes introducir
          información personal, confidencial o sensible en una herramienta.
          Cuando una herramienta funciona completamente en el navegador, sus
          entradas y resultados se procesan localmente y no se envían a UtiliHub
          por el mero hecho de utilizarlas.
        </p>

        <h2>3. Almacenamiento local</h2>
        <p>
          Algunas funciones, como favoritos, rachas y determinadas preferencias,
          pueden utilizar el almacenamiento local del navegador. Este mecanismo
          permite conservar información en tu propio dispositivo sin necesidad
          de crear una cuenta.
        </p>

        <h2>4. Analítica y rendimiento</h2>
        <p>
          UtiliHub puede utilizar servicios de analítica y medición de rendimiento
          para comprender el funcionamiento general del sitio y detectar problemas.
          Estos servicios pueden procesar información técnica sobre la visita,
          como datos del navegador, dispositivo, páginas visitadas o información
          necesaria para medir rendimiento, de acuerdo con sus propias políticas.
        </p>

        <h2>5. Publicidad</h2>
        <p>
          UtiliHub podrá incorporar publicidad de terceros en el futuro. Si se
          habilita publicidad basada en tecnologías que utilizan cookies,
          almacenamiento local u otros identificadores, se proporcionará la
          información y el mecanismo de consentimiento que corresponda según la
          ubicación del visitante y la legislación aplicable.
        </p>
        <p>
          Para visitantes del Espacio Económico Europeo, Reino Unido y Suiza,
          cuando corresponda, la publicidad personalizada se implementará con un
          mecanismo de gestión del consentimiento que cumpla los requisitos
          aplicables del proveedor publicitario.
        </p>

        <h2>6. Cookies y tecnologías similares</h2>
        <p>
          El sitio puede utilizar cookies o tecnologías similares cuando sean
          necesarias para servicios de terceros, analítica, preferencias o
          publicidad. Las opciones disponibles para gestionar estas tecnologías
          dependerán de los servicios efectivamente habilitados en cada momento.
        </p>

        <h2>7. Enlaces a terceros</h2>
        <p>
          UtiliHub puede enlazar a servicios externos. Las prácticas de privacidad
          de esos servicios se rigen por sus propias políticas y no por esta
          política.
        </p>

        <h2>8. Cambios en esta política</h2>
        <p>
          Esta política puede actualizarse cuando cambien las funciones del sitio,
          los servicios de terceros utilizados o las obligaciones legales
          aplicables. La fecha de actualización se mostrará al comienzo de esta
          página.
        </p>

        <h2>9. Contacto</h2>
        <p>
          Si necesitas realizar una consulta relacionada con privacidad, utiliza
          el canal de contacto que UtiliHub publique en el sitio cuando esté
          disponible.
        </p>
      </div>
    </article>
  );
}
