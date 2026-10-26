import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Atrapa Pulsos en Órbita: Guía del Juego de Timing Radial | UtiliHub";
const description = cleanDescription(
  "Guía original de largo formato sobre el juego interactivo Atrapa Pulsos en Órbita. Explica mecánicas de órbita radial, coincidencia de zonas que crecen hasta 8, multiplicadores de combo, pulsos de power-up, ráfagas de partículas, feedback háptico, zonas táctiles amplias, controles de teclado, compartir PNG con branding y estadísticas, y high scores en localStorage. Estrategias, distinción de otros juegos de pulsos y enlaces profundos a la experiencia en vivo.",
);

export const Route = createFileRoute("/es/guias/orbit-pulse-catcher")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/guias/orbit-pulse-catcher") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/guias/orbit-pulse-catcher") },
      ...hreflangLinks("/guides/orbit-pulse-catcher", "/es/guias/orbit-pulse-catcher"),
    ],
  }),
  component: OrbitPulseCatcherGuideEs,
});

function OrbitPulseCatcherGuideEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Guías", to: "/es/guias" }, { label: "Atrapa Pulsos en Órbita" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Atrapa Pulsos en Órbita: Domina el Timing Radial, los Combos y las Puntuaciones Altas</h1>
        <p className="lead">
          Atrapa Pulsos en Órbita es un juego interactivo de timing construido alrededor de mecánicas de órbita radial. Los pulsos viajan a lo largo de órbitas circulares mientras las zonas de coincidencia crecen desde unas pocas hasta ocho. Atrápalos en el momento correcto para construir combos, activar power-ups y perseguir puntuaciones altas. Esta guía original cubre el bucle principal, los sistemas de puntuación, el feedback visual y háptico, los controles, el compartir, la persistencia, estrategias prácticas y cómo se diferencia de otras experiencias de pulsos y arcade en UtiliHub.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Juega la experiencia en vivo</h3>
          <p className="mt-2 text-muted-foreground">
            Coincide pulsos en órbitas radiales, haz crecer tu combo y comparte tu mejor puntuación.
          </p>
          <Link
            to="/es/juegos/atrapa-pulsos-orbita"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir Atrapa Pulsos en Órbita
          </Link>
        </div>

        <h2>Mecánicas de órbita radial y coincidencia de zonas</h2>
        <p>
          Los pulsos se mueven continuamente a lo largo de una o más órbitas circulares. Las zonas de coincidencia aparecen como sectores o arcos radiales que debes golpear mientras el pulso está dentro de ellas. Los niveles iniciales usan menos zonas; a medida que aumenta la dificultad el número de zonas activas crece hacia un máximo de ocho. La precisión de timing importa más que la velocidad bruta: un pulso que apenas roza el borde de una zona puede contar, pero los fallos tempranos o tardíos rompen el combo.
        </p>
        <p>
          El diseño radial mantiene todo a la vista tanto en escritorio como en móvil. Debido a que el movimiento es circular en lugar de lineal, la visión periférica y el reconocimiento de ritmo se convierten en habilidades útiles.
        </p>

        <h2>Multiplicadores de combo y puntuación</h2>
        <p>
          Las capturas consecutivas exitosas aumentan un multiplicador de combo. Combos más altos otorgan más puntos por captura y desbloquean hitos visuales. Fallar un pulso reinicia el combo. Las mejores puntuaciones vienen de cadenas largas e ininterrumpidas en lugar de aciertos perfectos ocasionales.
        </p>

        <h2>Pulsos de power-up</h2>
        <p>
          Ciertos pulsos son power-ups. Atraparlos otorga bonificaciones temporales como una vida extra o un impulso de puntuación. Aparecen con menos frecuencia que los pulsos normales y suelen ser visualmente distintos. Usarlos en el momento adecuado puede extender una racha de combo alto o recuperarse de un casi fallo.
        </p>

        <h2>Ráfagas de partículas, feedback háptico y pulido visual</h2>
        <p>
          Las capturas exitosas, subidas de nivel y hitos de combo (especialmente en 5 y 10) activan ráfagas de partículas. Los efectos tienen un recuento y vida modesta para mantener el rendimiento. Las zonas táctiles amplias incluyen feedback de ondas. En dispositivos que lo soportan, los pulsos hápticos dan confirmación táctil sin depender solo de la vista o el sonido.
        </p>

        <h2>Controles: táctil y teclado</h2>
        <p>
          En pantallas táctiles las zonas son lo suficientemente grandes para toques cómodos. El soporte de teclado mapea las teclas numéricas 1-N y teclas cercanas de QWERTY a las zonas activas, permitiendo a los jugadores de escritorio mantenerse precisos sin mirar el teclado. Ambos métodos de entrada alimentan la misma lógica de timing y puntuación.
        </p>

        <h2>Compartir PNG y high scores en localStorage</h2>
        <p>
          Después de una buena racha puedes exportar un PNG que incluye el título del juego, el branding de UtiliHub y tu mejor puntuación, nivel y combo. Las puntuaciones altas persisten en localStorage para que sobrevivan recargas de página y reinicios del navegador. Nada sale del dispositivo excepto la imagen que eliges compartir.
        </p>

        <h2>Distinción de juegos relacionados</h2>
        <p>
          Pulse Catch Arena se centra en la captura de pulsos lineal o de estilo arena con reglas espaciales diferentes. Desafío de Refracción es un puzzle de física basado en apuntar y doblar la luz en lugar de un juego puro de timing. Atrapa Pulsos en Órbita se define por su diseño de órbita radial, el recuento creciente de zonas y el énfasis en el ritmo de combo sostenido.
        </p>

        <h2>Estrategias prácticas para puntuaciones altas</h2>
        <ul>
          <li>Prioriza la consistencia sobre la codicia: un combo medio sostenido a lo largo de niveles suele superar un estallido ultra-alto corto que termina temprano.</li>
          <li>Observa la velocidad de órbita y el recuento de zonas juntos; cuando las zonas se multiplican, reduce tu tolerancia al riesgo en aciertos de borde.</li>
          <li>Guarda los pulsos de power-up para momentos en los que tu combo ya es alto o cuando necesitas la vida extra para terminar un nivel.</li>
          <li>Usa el teclado en escritorio para un timing más ajustado; las ondas táctiles ayudan a confirmar los aciertos en móvil.</li>
          <li>Exporta un PNG de tu mejor racha — las estadísticas horneadas facilitan seguir el progreso a lo largo del tiempo.</li>
        </ul>

        <h2>Rendimiento y Core Web Vitals</h2>
        <p>
          El canvas se carga de forma perezosa en su propia ruta. Los recuentos y vidas de partículas están limitados. No se introducen dependencias pesadas nuevas. El resultado se mantiene seguro para CWV en móvil mientras entrega feedback visual y háptico claro.
        </p>

        <h2>Cómo UtiliHub implementa el juego</h2>
        <p>
          El componente del juego mantiene posiciones de órbita, zonas activas, estado de combo, vidas y puntuación. Cada fotograma avanza los pulsos, verifica intersecciones de zonas, activa partículas y hápticos en aciertos, y actualiza el almacén de high score. Las rutas en inglés y español se mantienen sincronizadas. Adsterra permanece intacto.
        </p>

        <h2>Experiencias relacionadas</h2>
        <ul>
          <li><Link to="/es/juegos/pulse-catch-arena">Pulse Catch Arena</Link> — reglas alternativas de captura de pulsos.</li>
          <li><Link to="/es/juegos/desafio-refraccion">Desafío de Refracción</Link> — puzzle de física de apuntar.</li>
          <li><Link to="/es/guias/modular-pattern-composer">Guía del Compositor de Patrones Modulares</Link> — guía companion de largo formato sobre otra superficie interactiva.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        <p>
          <strong>¿Cuántas zonas pueden aparecer?</strong> Las zonas de coincidencia crecen hasta un máximo de ocho a medida que avanzan los niveles.
        </p>
        <p>
          <strong>¿Los power-ups se apilan?</strong> Proporcionan efectos temporales (vida extra o impulso de puntuación). Atrapar otro mientras uno está activo suele refrescar o extender el beneficio.
        </p>
        <p>
          <strong>¿La puntuación alta se comparte online?</strong> No. Las puntuaciones se quedan en localStorage en tu dispositivo. El compartir PNG es la forma de mostrar a otros tu resultado.
        </p>
        <p>
          <strong>¿Funciona offline?</strong> Sí, una vez que la página ha cargado. Toda la lógica y persistencia son del lado del cliente.
        </p>
        <p>
          <strong>¿Puedo usar tanto táctil como teclado?</strong> Sí. Ambos inputs están activos y mapean a las mismas zonas.
        </p>

        <p className="mt-8">
          <Link to="/es/juegos/atrapa-pulsos-orbita" className="font-semibold text-primary">
            Abre Atrapa Pulsos en Órbita y comienza tu racha de puntuación alta →
          </Link>
        </p>
      </article>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
