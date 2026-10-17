import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Rendimiento de Canvas y WebGL para Experiencias Web Interactivas | UtiliHub";
const description = cleanDescription(
  "Guía original para mantener sistemas de partículas, simulaciones físicas y playgrounds a 60fps fluidos. requestAnimationFrame, object pooling, devicePixelRatio, reduced motion, presupuestos móviles y medición con Performance API.",
);

export const Route = createFileRoute("/es/guias/rendimiento-canvas-webgl")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/guias/rendimiento-canvas-webgl") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/guias/rendimiento-canvas-webgl") },
      ...hreflangLinks("/guides/canvas-webgl-performance", "/es/guias/rendimiento-canvas-webgl"),
    ],
  }),
  component: CanvasWebGLPerformanceGuideEs,
});

function CanvasWebGLPerformanceGuideEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Guías" }, { label: "Rendimiento Canvas y WebGL" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Rendimiento de Canvas y WebGL para Experiencias Interactivas Fluidas</h1>
        <p className="lead">
          Los sistemas de partículas interactivos, las simulaciones físicas y los playgrounds necesitan mantenerse a 60 fotogramas por segundo estables tanto en escritorio como en móvil. Esta guía original cubre técnicas prácticas usadas en UtiliHub: buenas prácticas de requestAnimationFrame, object pooling, manejo de devicePixelRatio, soporte de reduced-motion, presupuestos móviles y medición con la Performance API.
        </p>

        <h2>Por qué importan los 60fps</h2>
        <p>
          A 60fps cada fotograma dispone de unos 16,7 milisegundos. Cualquier trabajo que supere regularmente ese presupuesto produce fotogramas perdidos, jank y una sensación menos responsive. Canvas 2D y WebGL son potentes, pero siguen ejecutándose en el hilo principal junto a React, manejadores de entrada y layout. El objetivo es mantener el bucle de animación corto y predecible.
        </p>

        <h2>Buenas prácticas de requestAnimationFrame</h2>
        <p>
          Impulsa siempre la simulación con <code>requestAnimationFrame</code>. Se alinea con la tasa de refresco de la pantalla y se pausa automáticamente cuando la pestaña está en segundo plano.
        </p>
        <ul>
          <li>Guarda el id del callback para poder cancelarlo al desmontar o cuando el componente esté oculto.</li>
          <li>Calcula el delta-time (dt) desde el timestamp anterior, pero limítalo (por ejemplo máximo 50 ms) para que un fotograma largo no produzca un salto enorme.</li>
          <li>Prefiere un timestep de simulación fijo para estabilidad física y, si hace falta, renderiza con interpolación.</li>
          <li>Evita crear objetos, arrays o strings nuevos dentro del bucle.</li>
        </ul>

        <h2>Object pooling</h2>
        <p>
          Crear y descartar miles de objetos de partículas cada segundo provoca pausas de recolección de basura. El object pooling reutiliza las mismas instancias.
        </p>
        <p>
          Mantén una lista libre de partículas inactivas. Cuando necesites una nueva, sácala de la lista libre (o crece el pool si está vacía). Cuando una partícula muere, reinicia sus propiedades y devuélvela a la lista libre. El mismo patrón sirve para vectores temporales, segmentos de estela o buffers WebGL.
        </p>

        <h2>devicePixelRatio y pantallas de alta densidad</h2>
        <p>
          Las pantallas de alta densidad multiplican el número de píxeles que hay que rellenar. Configurar el backing store del canvas a <code>devicePixelRatio</code> da líneas nítidas, pero puede cuadruplicar el fill rate en una pantalla 2×.
        </p>
        <p>
          Enfoque práctico: usa un ratio limitado (por ejemplo <code>Math.min(window.devicePixelRatio, 2)</code>) y solo súbelo cuando la experiencia sea ligera. En escenas con muchas partículas, un ratio de 1 en móvil suele ser el mejor compromiso para fluidez.
        </p>

        <h2>Reduced motion y accesibilidad</h2>
        <p>
          Respeta la media query <code>prefers-reduced-motion</code>. Cuando coincida, reduce el número de partículas, desactiva estelas, ralentiza o pausa el movimiento continuo y evita gradientes animados grandes. Mejora la comodidad de usuarios con sensibilidad al movimiento y también reduce la carga de CPU/GPU.
        </p>

        <h2>Presupuestos móviles</h2>
        <p>
          Las GPU móviles y los límites térmicos son más estrictos. Reglas prácticas útiles:
        </p>
        <ul>
          <li>Ofrece un control de número de partículas o calidad que por defecto sea más bajo en pantallas pequeñas o punteros gruesos.</li>
          <li>Omite efectos costosos (bloom, blur grande, estelas de alta resolución) por debajo de un umbral de ancho.</li>
          <li>Pausa el bucle cuando el canvas esté fuera de pantalla (IntersectionObserver).</li>
          <li>Mantén el tamaño CSS del canvas fijo con una caja de aspect-ratio para que el layout no se desplace.</li>
        </ul>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Mira las técnicas en acción</h3>
          <p className="mt-2 text-muted-foreground">
            Partículas de Gravedad y Laboratorio de Imanes de Partículas usan estos patrones para mantenerse fluidos mientras interactúas.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/es/playgrounds/particulas-gravedad" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Partículas de Gravedad
            </Link>
            <Link to="/es/playgrounds/imanes-particulas" className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Laboratorio de Imanes
            </Link>
          </div>
        </div>

        <h2>Medición con la Performance API</h2>
        <p>
          Usa la Performance API del navegador para ver dónde se gasta realmente el tiempo.
        </p>
        <ul>
          <li><code>performance.now()</code> alrededor de las fases de actualización y dibujo.</li>
          <li><code>performance.mark</code> / <code>performance.measure</code> para secciones con nombre que aparecen en el panel Performance de DevTools.</li>
          <li>Vigila fotogramas largos (más de 50 ms) y eventos de GC. El object pooling y evitar asignaciones suelen eliminar los picos.</li>
          <li>En navegadores compatibles, <code>performance.memory</code> (Chrome) puede indicar crecimiento del heap si el pool tiene fugas.</li>
        </ul>
        <p>
          Graba una sesión corta mientras interactúas y mira el flame chart. El callback de animación debería ser una rebanada pequeña y regular del fotograma.
        </p>

        <h2>Trabajo fuera del hilo principal</h2>
        <p>
          El cálculo pesado que no necesita tocar el DOM o el canvas puede moverse a un Web Worker. Candidatos típicos: pathfinding, actualizaciones grandes de partículas que solo necesitan posiciones, o solvers de física. El hilo principal solo recibe el último estado y lo dibuja. El paso de mensajes tiene coste, así que agrupa actualizaciones en lugar de enviar cada partícula cada fotograma.
        </p>

        <h2>Experiencias relacionadas en UtiliHub</h2>
        <ul>
          <li><Link to="/es/playgrounds/particulas-gravedad">Partículas de Gravedad</Link> — atractores y órbitas.</li>
          <li><Link to="/es/playgrounds/imanes-particulas">Laboratorio de Imanes de Partículas</Link> — fuerzas magnéticas.</li>
          <li><Link to="/es/simuladores/pendulo-doble">Caos del Péndulo Doble</Link> — simulación física.</li>
          <li><Link to="/es/guias/fisica-particulas">Guía de Física de Partículas</Link> — los modelos de fuerza subyacentes.</li>
        </ul>

        <h2>Conclusión</h2>
        <p>
          Las experiencias interactivas fluidas a 60fps provienen de bucles disciplinados, reutilización de objetos, elecciones sensatas de resolución y respeto a las restricciones móviles y de reduced-motion. Mide primero y luego optimiza el camino caliente. Los playgrounds enlazados arriba demuestran estas ideas en la práctica.
        </p>
      </article>

      <div className="mt-12">
        <AdsterraBanner />
      </div>
    </div>
  );
}
