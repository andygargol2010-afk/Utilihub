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

        <h2>Integración numérica en el navegador</h2>
        <p>
          Una vez conocidas las aceleraciones, el simulador debe avanzar posiciones y velocidades. El esquema más simple es Euler hacia adelante:
        </p>
        <p className="text-center font-mono">
          v ← v + a · Δt<br />
          x ← x + v · Δt
        </p>
        <p>
          Euler es fácil de programar pero puede añadir energía con el tiempo, haciendo que las órbitas espiralen hacia fuera. Una mejor elección práctica para gravedad interactiva es el Euler semi-implícito (simpléctico), que actualiza primero la velocidad y luego usa la nueva velocidad para el paso de posición. Esto conserva mejor una energía cercana y mantiene las órbitas largas más estables con casi ningún coste extra.
        </p>
        <p>
          Existen Velocity Verlet y métodos de orden superior, pero para demos en tiempo real en el navegador con un límite de ~20 cuerpos el paso de Euler semi-implícito suele ser suficiente. El simulador de UtiliHub usa un paso de tiempo fijo o limitado para que la integración se mantenga estable incluso si baja la tasa de fotogramas, y aplica la repulsión de colisión suave dentro de la misma evaluación de fuerzas antes de la actualización de velocidad.
        </p>
        <p>
          La deriva numérica es inevitable: el preset figura-8 abandona lentamente su órbita periódica exacta tras muchos minutos. Eso es esperado y educativo — muestra por qué los códigos de astrofísica de producción usan integradores de orden superior y pasos adaptativos, mientras que los juguetes interactivos priorizan la respuesta y la claridad visual.
        </p>

        <h2>Energía, estabilidad y la intuición virial</h2>
        <p>
          La energía mecánica total E = cinética + potencial. Para un sistema gravitatorio aislado las ecuaciones continuas verdaderas conservan E exactamente. Los esquemas numéricos solo aproximan esa conservación. El Euler semi-implícito mantiene el error acotado durante muchas órbitas, por eso las estrellas binarias y la figura-8 permanecen reconocibles durante minutos de tiempo real.
        </p>
        <p>
          Una regla práctica útil es la relación virial para un sistema auto-gravitante en equilibrio aproximado: 2·KE + PE ≈ 0. Si lanzas cuerpos con demasiada velocidad el sistema no está ligado (energía total positiva) y todo se separa. Si los empiezas casi en reposo colapsan en un cúmulo compacto de alta velocidad. Los presets integrados se sitúan en el punto medio interesante donde coexisten órbitas ligadas, encuentros cercanos y eyecciones ocasionales.
        </p>
        <p>
          El suavizado y las colisiones suaves alteran ligeramente el potencial, por lo que la cantidad conservada no es exactamente la energía newtoniana. Es un compromiso deliberado: la simulación permanece visualmente estable e interactiva en lugar de producir singularidades numéricas.
        </p>

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

        <h2>Construir un binario circular a mano</h2>
        <p>
          Un binario circular limpio es una excelente forma de entender el equilibrio de fuerzas. Para dos masas iguales M orbitando su centro de masa común a una separación a (cada una a distancia a/2 del CM):
        </p>
        <p className="text-center font-mono">
          v = sqrt(G · M / a)
        </p>
        <p>
          Cada cuerpo se mueve perpendicular a la línea que los une, en direcciones opuestas, con esa velocidad. La aceleración centrípeta v² / (a/2) es suministrada exactamente por la aceleración gravitatoria G·M / a².
        </p>
        <p>
          En el simulador de UtiliHub el preset de estrellas binarias carga esencialmente esta configuración (suavizada ligeramente para comodidad numérica). Puedes recrearlo manualmente: coloca dos cuerpos de masa igual, dales velocidades tangenciales iguales y opuestas de la magnitud correcta, y observa una órbita estable. Si la velocidad es un poco baja la órbita se vuelve elíptica; si es demasiado alta los cuerpos se separan. El suavizado y el paso de tiempo finito hacen que la velocidad circular “perfecta” sea ligeramente distinta de la fórmula newtoniana pura — otro recordatorio educativo de las aproximaciones que aceptamos por interactividad.
        </p>
        <p>
          Pruébalo y luego compara con el preset de un clic. La diferencia entre “yo afiné los números” y “la biblioteca lo hizo” es exactamente el tipo de insight que esta guía pretende dar.
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
          <li>Integra velocidad y posición con un paso de tiempo fijo o limitado (estilo Euler semi-implícito).</li>
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
          <strong>¿Por qué la energía crece o disminuye lentamente?</strong> La mayoría de los integradores simples no son perfectamente simplécticos. El Euler semi-implícito mantiene el error acotado durante muchas órbitas, pero a lo largo de minutos de tiempo real verás pequeñas derivas — una demostración honesta de la aproximación numérica.
        </p>
        <p>
          <strong>¿Algo se ejecuta en un servidor?</strong> No. Toda la integración, el dibujo y la generación de PNG ocurren en el navegador. Compartir una URL solo comparte los parámetros.
        </p>
        <p>
          <strong>¿Puedo reproducir un enlace compartido?</strong> Sí. La URL codifica las masas, posiciones, velocidades y colores iniciales. Abrir el enlace restaura la configuración de partida exacta antes de que comience la integración.
        </p>
        <p>
          <strong>¿Por qué está limitado el número de cuerpos?</strong> La evaluación de fuerzas por pares es O(N²). Limitar a unos 20 cuerpos mantiene el tiempo de fotograma cómodo en móviles y aun así permite dinámicas multi-cuerpo ricas.
        </p>
        <p>
          <strong>¿Qué hace realmente el parámetro de suavizado?</strong> Sustituye la verdadera singularidad 1/r² por un potencial redondeado que permanece finito en r = 0. Un suavizado pequeño mantiene los encuentros cercanos dramáticos; un suavizado mayor hace el sistema más “pegajoso” y menos explosivo. El simulador elige un valor que se ve bien con los radios de cuerpo usados para las colisiones suaves.
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
