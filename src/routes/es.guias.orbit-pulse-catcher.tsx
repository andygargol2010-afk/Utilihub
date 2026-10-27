import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const TITLE =
  "Atrapa Pulsos en Órbita: timing radial, combos y puntuación alta | UtiliHub";
const DESCRIPTION =
  "Guía de Atrapa Pulsos en Órbita: zonas radiales, multiplicadores de combo, fórmula de puntuación con ejemplos y progresión de dificultad. Juega gratis en el navegador.";

export const Route = createFileRoute("/es/guias/orbit-pulse-catcher")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: cleanDescription(DESCRIPTION) },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: cleanDescription(DESCRIPTION) },
      { property: "og:url", content: absoluteUrl("/es/guias/orbit-pulse-catcher") },
      { property: "og:image", content: ogImage },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: cleanDescription(DESCRIPTION) },
      { name: "twitter:image", content: ogImage },
      ...hreflangLinks("/guides/orbit-pulse-catcher", "/es/guias/orbit-pulse-catcher"),
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/es/guias/orbit-pulse-catcher") }],
  }),
  component: EsOrbitPulseCatcherGuidePage,
});

function EsOrbitPulseCatcherGuidePage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Guías", to: "/es/guias" }, { label: "Atrapa Pulsos en Órbita" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Atrapa Pulsos en Órbita: Domina el Timing Radial, los Combos y las Puntuaciones Altas</h1>
        <p className="lead">
          Atrapa Pulsos en Órbita es un desafío de timing: un pulso gira y tenés que capturarlo cuando atraviesa la zona activa. Esta guía cubre mecánicas, combos, la fórmula de puntuación con ejemplos trabajados y cómo subir de nivel sin romper la racha.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Juega la experiencia en vivo</h3>
          <p className="mt-2 text-muted-foreground">
            Abrí el playground, practicá capturas y mirá cómo el combo multiplica cada acierto.
          </p>
          <Link
            to="/es/pulse-catch"
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Jugar Atrapa Pulsos en Órbita →
          </Link>
        </div>

        <h2>Mecánicas de órbita radial y coincidencia de zonas</h2>
        <p>
          El pulso se mueve en una trayectoria circular. En cada momento hay una o más zonas activas sobre el anillo; tu trabajo es pulsar (o hacer clic) cuando el pulso está dentro de esa zona. Un acierto suma puntos y alimenta el combo; un fallo o un retraso largo corta la racha.
        </p>
        <p>
          La dificultad sube al aumentar la velocidad angular y al reducir el arco de la zona. En niveles altos las zonas son más estrechas y el margen de error, menor. Aprendé el ritmo del nivel actual antes de perseguir clips al borde.
        </p>

        <h2>Multiplicadores de combo y puntuación</h2>
        <p>
          Cada captura exitosa dentro de la ventana de tiempo suma al combo. El multiplicador de combo crece con rachas largas; un fallo o una pausa demasiado larga lo reinicia. Un boost temporal puede aplicar un factor extra sobre el total de la captura.
        </p>
        <p>
          La puntuación de una captura combina una base por acierto, el factor de combo, el factor de nivel y, si está activo, el boost. Mantener el combo vale más que sumar capturas aisladas a ritmo bajo.
        </p>

        <h2>Fórmula exacta de puntuación y ejemplos trabajados</h2>
        <p>
          En la implementación actual, la puntuación por captura se puede modelar así (valores orientativos del playground):
        </p>
        <p>
          <strong>pts ≈ base × (1 + (combo − 1) × 0.4) × (1 + (nivel − 1) × 0.15) × (boost ? 1.8 : 1)</strong>
        </p>
        <p>
          Con base ≈ 24 puntos por captura limpia. El combo cuenta capturas seguidas sin fallo; el nivel empieza en 1. El boost, cuando está activo, multiplica por 1.8.
        </p>
        <p>
          <strong>Ejemplo 1 (juego temprano):</strong> Nivel 1, combo 3, sin boost. Factor combo = 1 + 2 × 0.4 = 1.8; factor nivel = 1 + 0.15 = 1.15; pts ≈ 24 × 1.8 × 1.15 = 50.
        </p>
        <p>
          <strong>Ejemplo 2 (combo medio + boost):</strong> Nivel 4, combo 8, boost activo. Factor combo = 1 + 7 × 0.4 = 3.8; factor nivel = 1 + 0.6 = 1.6; pts ≈ 24 × 3.8 × 1.6 × 1.8 = 263.
        </p>
        <p>
          <strong>Ejemplo 3 (nivel alto, sin boost):</strong> Nivel 7, combo 12, sin boost. Factor combo = 1 + 11 × 0.4 = 5.4; factor nivel = 1 + 1.05 = 2.05; pts ≈ 24 × 5.4 × 2.05 = 266.
        </p>

        <h2>Ventana de combo y reinicio</h2>
        <p>
          El combo crece si capturás dentro de aproximadamente 1.1 s desde la captura anterior. Se reinicia tras un fallo o si pasa más de 1.6 s sin acierto. Priorizá la continuidad del combo frente a arriesgar un borde dudoso.
        </p>

        <h2>Progresión de zonas y dificultad</h2>
        <p>
          Al subir de nivel aparecen más zonas o arcos más chicos. Una buena regla: dominá el centro del arco antes de perseguir clips de borde, y solo buscá esos clips cuando ya manejes más de 5 zonas con estabilidad.
        </p>

        <h2>Errores frecuentes</h2>
        <ul>
          <li>Pulsar por ritmo fijo sin mirar el pulso: el período cambia con el nivel.</li>
          <li>Romper un combo alto por un borde innecesario.</li>
          <li>Ignorar el boost cuando está activo y jugar demasiado seguro.</li>
          <li>No recalibrar después de un reinicio de combo.</li>
        </ul>

        <h2>Checklist antes de una run seria</h2>
        <ol>
          <li>Calentá 30–60 s en el nivel actual sin perseguir puntuación.</li>
          <li>Anotá mentalmente el arco cómodo (centro vs borde).</li>
          <li>Si el combo se corta, respirá y reconstruí; no fuerces el mismo error.</li>
          <li>Usá el boost en rachas ya estables, no en la primera captura tras un fallo.</li>
        </ol>

        <h2>Preguntas frecuentes</h2>
        <h3>¿Se puede jugar en el celular?</h3>
        <p>
          Sí. El playground responde a toques; en pantallas chicas priorizá el centro de la zona para no fallar por precisión de dedo.
        </p>
        <h3>¿Hay que crear cuenta?</h3>
        <p>No. Se juega en el navegador, sin registro.</p>
        <h3>¿La puntuación se guarda en un servidor?</h3>
        <p>
          El foco de esta experiencia es la práctica local y el feedback inmediato. Consultá la página del juego para el estado actual de rankings o guardado.
        </p>

        <div className="not-prose mt-10 flex flex-wrap gap-3">
          <Link
            to="/es/pulse-catch"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Jugar ahora
          </Link>
          <Link
            to="/es/guias"
            className="inline-flex items-center rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Más guías
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {SITE_NAME} — herramientas y playgrounds gratuitos en el navegador.
        </p>
      </article>

      <div className="mx-auto mt-10 max-w-3xl">
        <AdsterraBanner placement="guide-bottom" />
      </div>
    </div>
  );
}
