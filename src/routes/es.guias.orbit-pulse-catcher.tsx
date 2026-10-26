import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Atrapa Pulsos en Órbita: Guía del Juego de Timing Radial | UtiliHub";
const description = cleanDescription(
  "Guía original de largo formato sobre el juego interactivo Atrapa Pulsos en Órbita. Explica mecánicas de órbita radial, coincidencia de zonas que crecen hasta 8, multiplicadores de combo, pulsos de power-up, ráfagas de partículas, feedback háptico, zonas táctiles amplias, controles de teclado, compartir PNG con branding y estadísticas, y high scores en localStorage. Estrategias, patrones de ritmo, errores comunes, distinción de otros juegos de pulsos y enlaces profundos a la experiencia en vivo.",
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
          Atrapa Pulsos en Órbita es un juego interactivo de timing construido alrededor de mecánicas de órbita radial. Los pulsos viajan a lo largo de órbitas circulares mientras las zonas de coincidencia crecen desde unas pocas hasta ocho. Atrápalos en el momento correcto para construir combos, activar power-ups y perseguir puntuaciones altas. Esta guía original cubre el bucle principal, los sistemas de puntuación, el feedback visual y háptico, los controles, el compartir, la persistencia, estrategias prácticas, patrones de ritmo, errores comunes y cómo se diferencia de otras experiencias de pulsos y arcade en UtiliHub.
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
          El diseño radial mantiene todo a la vista tanto en escritorio como en móvil. Debido a que el movimiento es circular en lugar de lineal, la visión periférica y el reconocimiento de ritmo se convierten en habilidades útiles. Las zonas empiezan en cuatro y aumentan aproximadamente una cada dos niveles (tope en ocho), por lo que la ventana angular de cada zona se reduce a medida que avanza la partida.
        </p>

        <h2>Multiplicadores de combo y puntuación</h2>
        <p>
          Las capturas consecutivas exitosas aumentan un multiplicador de combo. Combos más altos otorgan más puntos por captura y desbloquean hitos visuales. Fallar un pulso reinicia el combo. Las mejores puntuaciones vienen de cadenas largas e ininterrumpidas en lugar de aciertos perfectos ocasionales.
        </p>
        <p>
          Los puntos por captura exitosa escalan con la longitud del combo, el nivel actual y cualquier boost de power-up activo. Un valor base se multiplica por un factor de combo (que crece con capturas sucesivas), un factor de nivel y un multiplicador de boost temporal cuando un power-up está activo. Los hitos de combo en 5 y 10 activan celebraciones extra de partículas sin alterar la fórmula subyacente.
        </p>

        <h2>Pulsos de power-up</h2>
        <p>
          Ciertos pulsos son power-ups. Atraparlos otorga bonificaciones temporales como una vida extra o un impulso de puntuación. Aparecen con menos frecuencia que los pulsos normales y suelen ser visualmente distintos (tono diferente y brillo más fuerte). Usarlos en el momento adecuado puede extender una racha de combo alto o recuperarse de un casi fallo. Las vidas tienen tope y el impulso de puntuación es de duración limitada.
        </p>

        <h2>Ráfagas de partículas, feedback háptico y pulido visual</h2>
        <p>
          Las capturas exitosas, subidas de nivel y hitos de combo (especialmente en 5 y 10) activan ráfagas de partículas. Los efectos tienen un recuento y vida modesta para mantener el rendimiento. Las zonas táctiles amplias incluyen feedback de ondas. En dispositivos que lo soportan, los pulsos hápticos dan confirmación táctil sin depender solo de la vista o el sonido. Los anillos de captura se expanden desde el punto de impacto y los aciertos de power-up producen chispas más densas.
        </p>

        <h2>Controles: táctil y teclado</h2>
        <p>
          En pantallas táctiles las zonas son lo suficientemente grandes para toques cómodos. El soporte de teclado mapea las teclas numéricas 1-N y teclas cercanas de QWERTY a las zonas activas, permitiendo a los jugadores de escritorio mantenerse precisos sin mirar el teclado. Ambos métodos de entrada alimentan la misma lógica de timing y puntuación. Los números de zona se dibujan dentro de los arcos para referencia rápida.
        </p>

        <h2>Compartir PNG y high scores en localStorage</h2>
        <p>
          Después de una buena racha puedes exportar un PNG que incluye el título del juego, el branding de UtiliHub y tu mejor puntuación, nivel y combo. Las puntuaciones altas persisten en localStorage para que sobrevivan recargas de página y reinicios del navegador. Nada sale del dispositivo excepto la imagen que eliges compartir.
        </p>

        <h2>Ejemplo trabajado: una ruta de puntuación alta a mitad de partida</h2>
        <p>
          Imagina un jugador que empieza en nivel 1 con cuatro zonas. Atrapa los primeros pulsos limpiamente, construyendo un combo hasta 4. Aparece un pulso de power-up (tono dorado). Lo atrapa, ganando una vida y un boost temporal de puntuación. Con el boost activo empuja el combo hasta 8 antes de que expire. En nivel 3 (cinco zonas) toma deliberadamente aciertos más seguros en el centro en lugar de clips de borde, manteniendo el combo vivo. Para cuando las zonas llegan a seis o siete ya ha acumulado suficientes puntos como para que un solo fallo sea menos devastador. Termina la partida exportando un PNG que muestra la puntuación final, nivel y pico de combo para comparación posterior.
        </p>
        <p>
          El ejemplo ilustra el equilibrio práctico: uso temprano del power-up para proteger vidas y amplificar la puntuación, seguido de un timing más conservador una vez que el número de zonas sube.
        </p>

        <h2>Reconocimiento de ritmo y anticipación de patrones</h2>
        <p>
          Debido a que los pulsos siguen un movimiento circular continuo, el intervalo de timing entre aciertos sucesivos de zona es relativamente estable en un nivel dado. Los jugadores que internalizan el período pueden empezar a anticipar la siguiente ventana de acierto en lugar de reaccionar puramente de forma visual. En niveles tempranos (cuatro zonas) el espaciado angular es amplio; un ritmo cómodo es un toque aproximadamente cada 0,6–0,8 segundos dependiendo de la velocidad de órbita. A medida que las zonas aumentan a seis o siete las ventanas se encogen y la cadencia requerida se vuelve más ajustada—practica igualar el ritmo de la órbita en lugar de perseguir pulsos individuales.
        </p>
        <p>
          Un ejercicio útil: silencia o ignora el pulso visual durante unos segundos y toca solo en el intervalo recordado, luego re-sincroniza. Las rachas exitosas a menudo muestran un ligero adelanto en la entrada de la zona en lugar de un acierto en el centro, dando un pequeño buffer contra reacciones tardías. Los pulsos de power-up interrumpen el patrón intencionadamente; trátalos como un breve descanso de ritmo en lugar de un reinicio forzado.
        </p>

        <h2>Errores comunes y cómo evitarlos</h2>
        <ul>
          <li><strong>Perseguir clips de borde por estilo:</strong> Los niveles tempranos recompensan la precisión, pero una vez que las zonas superan cinco el margen angular se reduce. Prefiere aciertos en el centro de la zona para proteger el combo.</li>
          <li><strong>Guardar power-ups demasiado tiempo:</strong> El boost de puntuación es de duración limitada. Actívalo mientras un combo ya está construyéndose para que el multiplicador se aplique a las capturas de mayor valor.</li>
          <li><strong>Ignorar el teclado en escritorio:</strong> El táctil funciona, pero el mapeo de teclas numéricas (1–N) reduce la latencia y te permite mantener los ojos en la órbita. Mapea las zonas una vez y quédate en las teclas.</li>
          <li><strong>Pánico después de un casi fallo:</strong> Un solo fallo reinicia el combo pero no termina la partida si quedan vidas. Reinicia mentalmente al nuevo ritmo en lugar de sobre-corregir la velocidad.</li>
          <li><strong>Saltarse la exportación PNG:</strong> Las estadísticas horneadas (puntuación, nivel, pico de combo) son el único registro persistente. Exporta después de cada récord personal para que el progreso sea visible más tarde.</li>
        </ul>

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
          <li>Nota el patrón de crecimiento de zonas: cuatro zonas al principio, luego una zona adicional aproximadamente cada dos niveles, hasta ocho. Ajusta tu escaneo visual en consecuencia.</li>
          <li>Internaliza el período de órbita temprano; la anticipación supera la reacción pura una vez que las zonas superan cinco.</li>
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
          <li><Link to="/es/guias/n-body-gravity">Guía de Gravedad N-Cuerpos</Link> — guía relacionada de simulación con sistemas de timing y partículas.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        <p>
          <strong>¿Cuántas zonas pueden aparecer?</strong> Las zonas de coincidencia crecen hasta un máximo de ocho a medida que avanzan los niveles. Empiezan en cuatro y aumentan aproximadamente cada dos niveles.
        </p>
        <p>
          <strong>¿Los power-ups se apilan?</strong> Proporcionan efectos temporales (vida extra o impulso de puntuación). Atrapar otro mientras uno está activo suele refrescar o extender el beneficio. Las vidas tienen tope.
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
        <p>
          <strong>¿Qué termina un combo?</strong> Un pulso fallado o una pausa larga sin una captura exitosa reinicia el contador de combo.
        </p>
        <p>
          <strong>¿Cómo maximizo el boost del power-up?</strong> Atrapa el power-up mientras tu combo ya está elevado para que el multiplicador temporal se aplique a las capturas de mayor valor.
        </p>
        <p>
          <strong>¿Hay una velocidad de órbita óptima a la que apuntar?</strong> La velocidad aumenta con el nivel. Enfócate en igualar el período actual en lugar de forzar un tempo fijo; el diseño radial hace que el intervalo sea predecible una vez que tienes unos pocos aciertos exitosos.
        </p>
        <p>
          <strong>¿Los efectos de partículas afectan el timing?</strong> No. Las partículas son solo visuales y no alteran las ventanas de colisión o puntuación. Permanecen modestas para proteger el rendimiento.
        </p>
        <p>
          <strong>¿Puedo reiniciar un nivel sin perder toda la partida?</strong> Las vidas permiten recuperarse de fallos individuales. Un reinicio completo (si está disponible en la UI) borra la puntuación actual pero preserva el high score en localStorage.
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
