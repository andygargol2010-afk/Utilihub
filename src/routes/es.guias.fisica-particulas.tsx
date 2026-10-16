import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Física de Partículas en el Navegador: Gravedad, Atracción y Sistemas | UtiliHub";
const description = cleanDescription(
  "Guía original sobre simulaciones de partículas en el navegador. Aprende cómo funcionan la gravedad, las fuerzas de atracción y los sistemas de partículas con fórmulas, explicaciones visuales, el bucle de simulación y ejemplos en vivo. Prueba Gravity Particles y Río de Luz.",
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
          Las simulaciones de partículas que se ejecutan completamente en el navegador se han convertido en una forma potente de explorar conceptos de física, crear arte interactivo y construir experiencias atractivas. Esta guía original explica los mecanismos centrales detrás de la gravedad, las fuerzas de atracción y los sistemas de partículas — con fórmulas, intuición visual, el bucle de simulación y enlaces directos a playgrounds en vivo en UtiliHub.
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

        <h2>El bucle de simulación en la práctica</h2>
        <p>
          Cada fotograma el motor hace aproximadamente lo siguiente (pseudocódigo simplificado):
        </p>
        <pre className="text-sm">
{`para cada partícula:
  fuerza = {x: 0, y: 0}
  para cada atractor:
    dx = atractor.x - partícula.x
    dy = atractor.y - partícula.y
    dist = sqrt(dx*dx + dy*dy) + suavizado
    intensidad = atractor.masa / (dist * dist)
    fuerza.x += dx * intensidad
    fuerza.y += dy * intensidad
  partícula.vx += fuerza.x * dt
  partícula.vy += fuerza.y * dt
  partícula.vx *= amortiguación   // p.ej. 0.995 para evitar velocidad infinita
  partícula.vy *= amortiguación
  partícula.x += partícula.vx * dt
  partícula.y += partícula.vy * dt
  // opcional: reciclar si el tiempo de vida expiró o está fuera de límites
dibujar partículas (o rastros)`}
        </pre>
        <p>
          El delta-time (<code>dt</code>) mantiene el movimiento consistente a diferentes tasas de fotogramas. La amortiguación evita que las partículas aceleren para siempre cuando los atractores son fuertes.
        </p>

        <h2>Sistemas de partículas como flujos continuos</h2>
        <p>
          No todo sistema de partículas trata de atractores discretos. En el Viaje Río de Luz, las partículas se emiten a lo largo de un camino definido por puntos de paso. Cada partícula sigue una spline o curva interpolada entre puntos, con rastros de post-resplandor persistentes y efectos de bloom suave. La densidad, velocidad, color y modo de bucle controlan la densidad visual del río fluente.
        </p>
        <p>
          La idea clave es emisión continua + tiempo de vida: nuevas partículas nacen al inicio del camino, viajan hacia el final y se desvanecen. La superposición de muchas crea el efecto de corriente luminosa sólida.
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

        <h2>Variaciones comunes con las que puedes experimentar</h2>
        <ul>
          <li><strong>Repulsores</strong> — invierte la dirección de la fuerza para que las partículas sean empujadas lejos. Útil para explosiones o evitación.</li>
          <li><strong>Amortiguación / fricción</strong> — multiplica la velocidad por un factor < 1 cada fotograma. Detiene la aceleración descontrolada y crea órbitas más naturales.</li>
          <li><strong>Rastros y post-resplandor</strong> — almacena las últimas N posiciones y dibuja líneas con opacidad decreciente. Crea el aspecto de río brillante o cometa.</li>
          <li><strong>Mapeo de color</strong> — tiñe las partículas por velocidad, distancia al atractor, tiempo de vida o un hash de su índice.</li>
          <li><strong>Suavizado</strong> — añade una constante pequeña al denominador para evitar división por cero o fuerzas infinitas cuando una partícula cae exactamente sobre un atractor.</li>
        </ul>
        <p>
          Estas ideas aparecen en experiencias de UtiliHub: Firma de Partículas (atractores sembrados por texto), Mapa de Constelación (pozos de gravedad + líneas de conexión), Firma de Fuegos Artificiales y más.
        </p>

        <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
          <Link to="/es/playgrounds/firma-particulas" className="rounded-xl border p-4 hover:border-primary/40">
            <h3 className="font-bold">Firma de Partículas</h3>
            <p className="mt-1 text-sm text-muted-foreground">Escribe un nombre. Las partículas orbitan atractores sembrados por el texto.</p>
          </Link>
          <Link to="/es/constellation" className="rounded-xl border p-4 hover:border-primary/40">
            <h3 className="font-bold">Mapa de Constelación</h3>
            <p className="mt-1 text-sm text-muted-foreground">Las estrellas forman letras con pozos de gravedad y líneas temporales.</p>
          </Link>
        </div>

        <h2>Consideraciones de rendimiento en el navegador</h2>
        <ul>
          <li>Usa arrays tipados o pools de objetos para evitar pausas por recolección de basura.</li>
          <li>Agrupa operaciones de dibujo (una sola llamada fill/stroke cuando sea posible).</li>
          <li>Limita el número de partículas en móvil; el Gravity Particles Playground expone un control para esto.</li>
          <li>Prefiere requestAnimationFrame e integración con delta-time para velocidad consistente entre dispositivos.</li>
          <li>Para efectos más avanzados, WebGL o WebGPU pueden manejar decenas de miles de partículas.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        <h3>¿Puedo ejecutar simulaciones de partículas en el navegador sin WebGL?</h3>
        <p>
          Sí. Canvas 2D es más que suficiente para unos cientos hasta un par de miles de partículas con dibujo simple. El Gravity Particles Playground y el Río de Luz funcionan bien con Canvas. WebGL se vuelve útil cuando quieres decenas de miles de partículas o shaders complejos.
        </p>
        <h3>¿Cómo evito que las partículas vuelen al infinito?</h3>
        <p>
          Aplica amortiguación (velocidad *= 0.99 o similar) cada fotograma y/o usa una fuerza suavizada que decae con la distancia. También puedes limitar la velocidad máxima.
        </p>
        <h3>¿Es la física precisa?</h3>
        <p>
          Los sistemas de partículas del navegador priorizan el atractivo visual y la interacción en tiempo real sobre la precisión numérica. Usan integración newtoniana simplificada y a menudo ignoran la masa o usan masa unitaria. Para exploración educativa son excelentes; para precisión científica necesitarías integradores de orden superior y pasos de tiempo más pequeños.
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
