import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Física de Partículas en el Navegador: Gravedad, Atracción y Sistemas | UtiliHub";
const description = cleanDescription(
  "Guía original sobre simulaciones de partículas en el navegador. Aprende cómo funcionan la gravedad, las fuerzas de atracción y los sistemas de partículas con fórmulas, explicaciones visuales y ejemplos en vivo. Prueba Gravity Particles y Río de Luz.",
);

export const Route = createFileRoute("/es/guias/fisica-particulas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/guias/fisica-particulas") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/guias/fisica-particulas") },
      ...hreflangLinks("/guides/particle-physics", "/es/guias/fisica-particulas"),
    ],
  }),
  component: ParticlePhysicsGuideEs,
});

function ParticlePhysicsGuideEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Guías", to: "/es/guias" }, { label: "Física de partículas" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Física de Partículas en el Navegador: Cómo Funcionan la Gravedad, la Atracción y los Sistemas</h1>
        <p className="lead">
          Las simulaciones de partículas que se ejecutan completamente en el navegador se han convertido en una forma potente de explorar conceptos de física, crear arte interactivo y construir experiencias atractivas. Esta guía original explica los mecanismos centrales detrás de la gravedad, las fuerzas de atracción y los sistemas de partículas — con fórmulas, intuición visual y enlaces directos a playgrounds en vivo en UtiliHub.
        </p>

        <h2>¿Qué es un sistema de partículas?</h2>
        <p>
          Un sistema de partículas es una colección de muchas entidades pequeñas (partículas) que se mueven según reglas simples. Cada partícula suele tener posición, velocidad y a veces masa o tiempo de vida. Al aplicar fuerzas a miles de ellas simultáneamente, aparecen comportamientos emergentes complejos: órbitas, ríos de luz, explosiones, flujos similares a fluidos o campos de estrellas.
        </p>
        <p>
          En el navegador usamos la API de Canvas o WebGL. El bucle de simulación corre en cada fotograma de animación (requestAnimationFrame), actualizando posiciones con mecánica newtoniana básica aproximada para rendimiento en tiempo real.
        </p>

        <h2>Gravedad y fuerzas de atracción</h2>
        <p>
          La fuerza gravitacional clásica entre dos cuerpos viene dada por la ley de Newton:
        </p>
        <p className="text-center font-mono text-lg">
          F = G · (m1 · m2) / r²
        </p>
        <p>
          En simulaciones interactivas del navegador a menudo simplificamos esto. Para una partícula atraída hacia un atractor fijo (un punto que el usuario coloca al hacer clic), la dirección de la fuerza es el vector de la partícula al atractor, y la magnitud suele ser:
        </p>
        <p className="text-center font-mono">
          aceleración = fuerza · (posAtractor - posPartícula) / distancia
        </p>
        <p>
          O una versión suavizada para evitar fuerza infinita a distancia cero:
        </p>
        <p className="text-center font-mono">
          fuerza = intensidad / (distancia² + suavizado)
        </p>
        <p>
          La velocidad se actualiza con <code>v += a · dt</code> y la posición con <code>p += v · dt</code>. Múltiples atractores simplemente suman sus fuerzas. Este es exactamente el modelo usado en el Gravity Particles Playground.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Pruébalo en vivo</h3>
          <p className="mt-2 text-muted-foreground">
            Haz clic para colocar atractores y mira cómo las partículas orbitan en tiempo real. Ajusta la intensidad de la gravedad y el número de partículas.
          </p>
          <Link
            to="/es/playgrounds/particulas-gravedad"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir Gravity Particles Playground
          </Link>
        </div>

        <h2>Cómo funciona el bucle de simulación</h2>
        <p>
          Cada fotograma el navegador llama al callback de animación. Dentro hacemos tres cosas en orden: limpiar o desvanecer el canvas, actualizar cada partícula y luego dibujar cada partícula.
        </p>
        <p>
          Paso de actualización para una partícula: calcular la aceleración total sumando las fuerzas de todos los atractores (u otras fuentes), multiplicar por el paso de tiempo dt (normalmente una fracción fija de segundo), sumar eso a la velocidad actual y luego sumar la nueva velocidad multiplicada por dt a la posición. Un amortiguamiento opcional multiplica la velocidad por un factor ligeramente menor que 1 para que las partículas pierdan energía lentamente.
        </p>
        <p>
          El dibujo suele ser un arco o imagen simple por partícula. Los rastros se pueden hacer sin limpiar completamente el canvas cada fotograma, o guardando un historial corto de posiciones por partícula y trazándolos.
        </p>

        <h2>Variaciones y ajustes comunes</h2>
        <p>
          El suavizado evita que las partículas exploten cuando se acercan demasiado a un atractor. Una constante pequeña añadida dentro del término de distancia al cuadrado mantiene la fuerza finita.
        </p>
        <p>
          Se pueden combinar múltiples tipos de fuerza: atracción, repulsión (intensidad negativa), arrastre proporcional a la velocidad y ruido o empujones aleatorios para movimiento orgánico. El tiempo de vida y el tamaño pueden desvanecerse para que las partículas aparezcan y desaparezcan suavemente.
        </p>
        <p>
          En sistemas de flujo continuo como Río de Luz la posición no se integra a partir de fuerzas; en cambio cada partícula tiene un parámetro t que avanza a lo largo de un camino predefinido. El color y la opacidad son funciones de ese parámetro, creando el efecto de río brillante.
        </p>

        <div className="not-prose my-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <h3 className="text-lg font-bold">Experimenta el río</h3>
          <p className="mt-2 text-muted-foreground">
            Coloca puntos de paso y mira un río continuo de partículas brillantes fluir entre ellos.
          </p>
          <Link
            to="/es/rio-luz"
            className="mt-4 inline-flex rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Abrir Viaje Río de Luz
          </Link>
        </div>

        <h2>Sistemas de partículas como flujos continuos</h2>
        <p>
          No todo sistema de partículas trata de atractores discretos. En el Viaje Río de Luz, las partículas se emiten a lo largo de un camino definido por puntos de paso. Cada partícula sigue una spline o curva interpolada entre puntos, con rastros de post-resplandor persistentes y efectos de bloom suave. La densidad, velocidad, color y modo de bucle controlan la densidad visual del río fluente.
        </p>
        <p>
          La idea clave es emisión continua + tiempo de vida: nuevas partículas nacen al inicio del camino, viajan hacia el final y se desvanecen. La superposición de muchas crea el efecto de corriente luminosa sólida.
        </p>

        <h2>Consideraciones de rendimiento en el navegador</h2>
        <ul>
          <li>Usa arrays tipados o pools de objetos para evitar pausas por recolección de basura.</li>
          <li>Agrupa operaciones de dibujo (una sola llamada fill/stroke cuando sea posible).</li>
          <li>Limita el número de partículas en móvil; el Gravity Particles Playground expone un control para esto.</li>
          <li>Prefiere requestAnimationFrame e integración con delta-time para velocidad consistente entre dispositivos.</li>
          <li>Para efectos más avanzados, WebGL o WebGPU pueden manejar decenas de miles de partículas.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        <p>
          <strong>¿Por qué las partículas a veces salen de la pantalla?</strong> Sin amortiguamiento o una fuerza de contención conservan la velocidad ganada cerca de un atractor. Añadir un pequeño término de arrastre o envolver las posiciones mantiene el sistema estable.
        </p>
        <p>
          <strong>¿Puedo usar esto para simulación de fluidos?</strong> Los sistemas de partículas simples aproximan fluidos añadiendo repulsión entre vecinos y viscosidad. Los solucionadores reales de fluidos (SPH o basados en malla) son más pesados pero siguen el mismo patrón de fuerza e integración.
        </p>
        <p>
          <strong>¿La física se ejecuta en el servidor?</strong> No. Todo ocurre en el navegador con Canvas o WebGL. Compartir una URL solo comparte los parámetros, no una simulación del lado del servidor.
        </p>

        <h2>Exploración adicional</h2>
        <p>
          Los mismos principios impulsan muchas experiencias interactivas: firmas de partículas que forman texto, mapas de constelaciones, rastros de fuegos artificiales y patrones caleidoscópicos. Entender el bucle básico de fuerza e integración te permite inventar nuevos comportamientos rápidamente.
        </p>
        <p>
          Todas las simulaciones en UtiliHub se ejecutan completamente del lado del cliente — no se envían datos a servidores para la física en sí. Experimenta, comparte las URLs resultantes y descarga instantáneas PNG.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
