import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Simulaciones Interactivas de Gravedad N-Cuerpos en el Navegador | UtiliHub";
const description = cleanDescription(
  "Guía original sobre simulaciones de gravedad N-cuerpos y multi-atractor. Suma de fuerzas newtonianas, colisiones suaves, rastros que se desvanecen, brillo de cuerpos, presets (binario, mini-solar, caótico, figura-8), zoom/pan, límites de rendimiento. Simulador N-Body Gravity en vivo explicado con fórmulas e intuición.",
);

export const Route = createFileRoute("/es/guias/n-body-gravity")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/guias/n-body-gravity") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/guias/n-body-gravity") },
      ...hreflangLinks("/guides/n-body-gravity", "/es/guias/n-body-gravity"),
    ],
  }),
  component: NBodyGravityGuideEs,
});

function NBodyGravityGuideEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Guías", to: "/es/guias" }, { label: "Gravedad N-cuerpos" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Simulaciones Interactivas de Gravedad N-Cuerpos y Multi-Atractor en el Navegador</h1>
        <p className="lead">
          Las simulaciones de gravedad N-cuerpos permiten colocar múltiples cuerpos celestes que se atraen entre sí según la mecánica newtoniana y observar en tiempo real las órbitas, colisiones y movimientos caóticos resultantes. Esta guía original explica las ideas centrales — suma de fuerzas, colisiones suaves, rastros que se desvanecen, brillo de cuerpos, presets, controles de cámara y límites de rendimiento — y muestra cómo el Simulador de Gravedad N-Cuerpos en vivo de UtiliHub las implementa.
        </p>

        <h2>¿Qué es una simulación N-cuerpos?</h2>
        <p>
          En un problema de N-cuerpos cada cuerpo ejerce una fuerza gravitatoria sobre todos los demás. No existe solución analítica cerrada para N mayor que 2, por lo que integramos las ecuaciones de movimiento numéricamente. Cada cuerpo lleva masa, posición y velocidad. En cada paso de tiempo calculamos la fuerza neta sobre cada cuerpo, la convertimos en aceleración y actualizamos velocidad y posición.
        </p>
        <p>
          Las implementaciones en el navegador ejecutan este bucle dentro de requestAnimationFrame (o un acumulador de paso fijo) para que el movimiento se mantenga fluido e interactivo. Los usuarios pueden añadir cuerpos, cambiar condiciones iniciales, pausar, hacer zoom y compartir el estado inicial exacto mediante URL.
        </p>

        <h2>Suma de fuerzas newtonianas</h2>
        <p>
          La fuerza gravitatoria entre dos masas puntuales es
        </p>
        <p className="text-center font-mono text-lg">
          F = G · m₁ · m₂ / r²
        </p>
        <p>
          La dirección es a lo largo de la línea que une los cuerpos. En código trabajamos normalmente con vectores:
        </p>
        <p className="text-center font-mono">
          aᵢ = Σⱼ≠ᵢ G · mⱼ · (xⱼ − xᵢ) / (|xⱼ − xᵢ|³ + ε)
        </p>
        <p>
          El parámetro de suavizado ε (o una constante pequeña añadida en el término de distancia) evita que la fuerza se vuelva infinita cuando dos cuerpos ocupan casi la misma posición. Cada cuerpo suma las contribuciones de todos los demás — una operación O(N²) que es perfectamente viable para los números modestos de cuerpos usados en demos interactivas.
        </p>
        <p>
          El Simulador de Gravedad N-Cuerpos usa exactamente esta suma por pares con un factor de suavizado configurable para que las órbitas permanezcan estables y visualmente interesantes en lugar de explotar en acercamientos cercanos.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Prueba el simulador en vivo</h3>
          <p className="mt-2 text-muted-foreground">
            Añade cuerpos, elige presets (estrellas binarias, mini sistema solar, cúmulo caótico, figura-8), haz zoom, pan y comparte la escena.
          </p>
          <Link
            to="/es/n-body-gravity"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir Simulador de Gravedad N-Cuerpos
          </Link>
        </div>

        <h2>Colisiones suaves</h2>
        <p>
          Las colisiones de esferas rígidas requieren detección precisa y resolución de impulsos, lo que puede ser costoso y visualmente abrupto. Las colisiones suaves aproximan el contacto añadiendo una fuerte repulsión de corto alcance (o aumentando temporalmente el suavizado) cuando la distancia entre centros cae por debajo de la suma de radios.
        </p>
        <p>
          En el simulador, los cuerpos que se solapan reciben una aceleración repulsiva extra proporcional a la profundidad de penetración. Combinada con la atracción gravitatoria habitual, esto produce rebotes de aspecto elástico sin una tubería de colisión separada, manteniendo el código simple y el presupuesto de fotograma predecible.
        </p>

        <h2>Rastros que se desvanecen y brillo de cuerpos</h2>
        <p>
          Los rastros hacen legibles las trayectorias orbitales. En lugar de almacenar historiales largos de posiciones, el canvas se limpia con un relleno semi-transparente cada fotograma (desvanecimiento alfa). Las posiciones anteriores permanecen visibles unos fotogramas y luego desaparecen, creando el clásico aspecto de “motion blur” de las visualizaciones de gravedad.
        </p>
        <p>
          El brillo de los cuerpos es un simple degradado radial o círculo aditivo dibujado bajo cada cuerpo. Un resalte especular (un pequeño punto más brillante desplazado hacia una dirección de luz) da a las esferas sensación de volumen. Ambos efectos son operaciones baratas de canvas 2D y se mantienen seguras para CWV incluso en móvil cuando el número de cuerpos está limitado.
        </p>

        <h2>Presets y condiciones iniciales interesantes</h2>
        <p>
          El simulador incluye varios estados iniciales cuidadosamente elegidos:
        </p>
        <ul>
          <li><strong>Estrellas binarias</strong> — dos cuerpos de masa igual en órbita circular alrededor de su centro de masa común.</li>
          <li><strong>Mini sistema solar</strong> — un cuerpo central pesado más varios orbitadores más ligeros con velocidades aproximadamente circulares.</li>
          <li><strong>Cúmulo caótico</strong> — muchos cuerpos de masas mixtas y velocidades aleatorias que rápidamente producen encuentros cercanos y eyecciones.</li>
          <li><strong>Figura-8</strong> — una solución periódica conocida de tres cuerpos (Chenciner–Montgomery) que traza una trayectoria en forma de ocho. Una buena demostración de que no todo problema de tres cuerpos es caótico.</li>
        </ul>
        <p>
          Cada preset se puede cargar al instante y luego modificar. El estado resultante es serializable en la URL para que un enlace compartido reconstruya las condiciones iniciales exactas.
        </p>

        <h2>Cámara: zoom, pan y pellizco</h2>
        <p>
          Una transformación mundo-a-pantalla permite explorar sistemas grandes. El zoom se aplica con la rueda del ratón o el gesto de pellizco; el pan es un arrastre. La transformación se almacena como escala y desplazamiento y se aplica tanto al proyectar posiciones de cuerpos para dibujar como al convertir coordenadas de puntero de vuelta al espacio mundo para añadir nuevos cuerpos.
        </p>
        <p>
          Atajos de teclado (Espacio para pausar, R para resetear cámara, C para limpiar, +/− para zoom) hacen la experiencia usable sin ratón. Todo esto está implementado en el simulador en vivo.
        </p>

        <h2>Límites de rendimiento y Core Web Vitals</h2>
        <p>
          La gravedad N-cuerpos interactiva es O(N²) por fotograma. El simulador por tanto limita el número de cuerpos (típicamente alrededor de 20) para que la actualización se mantenga bien por debajo de 16 ms en dispositivos de gama media. El canvas se carga de forma perezosa en su propia ruta, nunca se importa en la página de inicio, y usa un contenedor de relación de aspecto fija para evitar cambios de diseño.
        </p>
        <p>
          Los rastros usan un único clear semi-transparente en lugar de arrays de historial por cuerpo. El brillo y los resaltes especulares se dibujan con unas pocas llamadas a canvas. El resultado es una experiencia visualmente rica que no regresa el CWV móvil.
        </p>

        <h2>Cómo el Simulador de Gravedad N-Cuerpos de UtiliHub implementa estas ideas</h2>
        <p>
          El componente mantiene un array de objetos cuerpo (masa, posición, velocidad, color, radio). Cada fotograma de animación:
        </p>
        <ol>
          <li>Calcula aceleraciones gravitatorias por pares con suavizado.</li>
          <li>Añade repulsión de colisión suave cuando los cuerpos se solapan.</li>
          <li>Integra velocidad y posición con un paso de tiempo fijo o limitado.</li>
          <li>Aplica la transformación de cámara y dibuja rastros (clear con fade) + cuerpos brillantes con resaltes especulares.</li>
        </ol>
        <p>
          Presets, zoom/pan, controles de teclado, exportación PNG (con título y branding horneados) y deep-linking por URL de condiciones iniciales forman parte de la misma superficie. Las rutas en inglés y español se mantienen sincronizadas.
        </p>

        <h2>Preguntas frecuentes</h2>
        <p>
          <strong>¿Por qué a veces los cuerpos se separan volando?</strong> Si las velocidades iniciales son demasiado altas respecto a las masas, el sistema no está ligado. Los presets están afinados para mantenerse interesantes; siempre puedes bajar velocidades o aumentar masas.
        </p>
        <p>
          <strong>¿El preset figura-8 es exacto?</strong> Usa las condiciones iniciales bien conocidas de la solución figura-ocho de Chenciner–Montgomery. La integración numérica introduce una pequeña deriva a lo largo del tiempo, pero la trayectoria característica es claramente visible.
        </p>
        <p>
          <strong>¿Algo se ejecuta en un servidor?</strong> No. Toda la integración, el dibujo y la generación de PNG ocurren en el navegador. Compartir una URL solo comparte los parámetros.
        </p>

        <h2>Experiencias relacionadas</h2>
        <ul>
          <li><Link to="/es/n-body-gravity">Simulador de Gravedad N-Cuerpos</Link> — la experiencia interactiva en vivo descrita arriba.</li>
          <li><Link to="/es/playgrounds/particulas-gravedad">Partículas de gravedad</Link> — muchas partículas ligeras atraídas a atractores fijos colocados por el usuario.</li>
          <li><Link to="/es/aurora-particle-playground">Aurora Particle Playground</Link> — sistemas de bloom multimodo con rastros y fuerzas de puntero.</li>
          <li><Link to="/es/guias/fisica-particulas">Guía de física de partículas</Link> — introducción más amplia a sistemas de partículas y atractores.</li>
        </ul>

        <h2>Conclusión</h2>
        <p>
          Las simulaciones de gravedad N-cuerpos convierten un corto bucle de integración numérica en una experiencia atractiva y compartible. Al combinar suma newtoniana suavizada, colisiones suaves, rastros que se desvanecen, brillo de cuerpos y presets cuidadosamente elegidos, el navegador puede albergar dinámicas celestes sorprendentemente ricas sin dependencias pesadas ni cálculo del lado del servidor.
        </p>
        <p>
          Abre el Simulador de Gravedad N-Cuerpos en vivo, prueba los presets y experimenta con tus propias condiciones iniciales. Todo se ejecuta del lado del cliente.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
