import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Compositor de Patrones Modulares: Sistemas de Baldosas y Animaciones Procedurales | UtiliHub";
const description = cleanDescription(
  "Guía original sobre el Compositor de Patrones Modulares. Coloca baldosas modulares en una cuadrícula con animaciones procedurales en vivo (flujo, pulso, morph, giro), multi-capas con mezcla y opacidad, simetría (espejo, radial), biblioteca de baldosas (geométricas, orgánicas, partículas, hex, blob), paletas y gradientes, controles de reproducción, tamaño de pincel, compartir PNG con branding, deep-link por URL y persistencia en localStorage. Distinto del neon freehand.",
);

export const Route = createFileRoute("/es/guias/modular-pattern-composer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/guias/modular-pattern-composer") },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/guias/modular-pattern-composer") },
      ...hreflangLinks("/guides/modular-pattern-composer", "/es/guias/modular-pattern-composer"),
    ],
  }),
  component: ModularPatternGuideEs,
});

function ModularPatternGuideEs() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Guías", to: "/es/guias" }, { label: "Compositor de Patrones Modulares" }]} />
      <article className="prose prose-slate mt-6 max-w-3xl dark:prose-invert">
        <h1>Compositor de Patrones Modulares: Sistemas de Baldosas Interactivos con Animaciones Procedurales en Vivo</h1>
        <p className="lead">
          El Compositor de Patrones Modulares permite construir sistemas visuales repetibles colocando baldosas modulares en una cuadrícula. Cada baldosa puede ejecutar animaciones procedurales en vivo (flujo, pulso, morph, giro), las capas se mezclan con opacidad independiente y los modos de simetría multiplican las colocaciones. Esta guía original explica el modelo de cuadrícula, los modos de animación, el flujo multi-capa, la biblioteca de baldosas, los sistemas de color, los controles de reproducción, la edición con pincel, el compartir y la persistencia — y cómo la experiencia en vivo de UtiliHub los implementa.
        </p>

        <h2>¿Qué es un compositor de patrones modulares?</h2>
        <p>
          A diferencia de las herramientas de dibujo freehand, un compositor modular trabaja con una cuadrícula discreta de celdas. Eliges una baldosa de la biblioteca, seleccionas un tamaño de pincel y la estampas en una o varias celdas. El resultado es un sistema repetible y editable en lugar de un trazo continuo. Las animaciones procedurales dan vida a las baldosas sin que tengas que dibujar cada fotograma a mano.
        </p>
        <p>
          Este enfoque es excelente para patrones, fondos, arte generativo y sistemas de diseño que necesitan mantenerse consistentes al escalar o compartir. La composición es datos, no solo píxeles, por lo que se puede persistir, deep-linkear y re-editar después.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Prueba el compositor en vivo</h3>
          <p className="mt-2 text-muted-foreground">
            Coloca baldosas, activa animaciones, añade capas, aplica simetría y comparte tu composición.
          </p>
          <Link
            to="/es/modular-pattern-composer"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Abrir Compositor de Patrones Modulares
          </Link>
        </div>

        <h2>Cuadrícula y baldosas modulares</h2>
        <p>
          El canvas se divide en una cuadrícula regular (típicamente 12×12 celdas para un buen equilibrio entre detalle y rendimiento). Cada celda puede contener una instancia de baldosa que referencia una entrada de la biblioteca más parámetros opcionales como color, rotación o fase de animación. Como las baldosas son modulares, puedes borrar o sobrescribir celdas individuales sin destruir el resto de la composición.
        </p>
        <p>
          El tamaño de pincel permite estampar un cuadrado de celdas en un solo gesto. Esto acelera el relleno de regiones mientras el resultado sigue siendo completamente editable a nivel de celda.
        </p>

        <h2>Animaciones procedurales en vivo</h2>
        <p>
          Cada tipo de baldosa puede impulsar una o más animaciones procedurales que se ejecutan cada fotograma:
        </p>
        <ul>
          <li><strong>Flujo</strong> — movimiento direccional continuo o desplazamiento impulsado por ruido.</li>
          <li><strong>Pulso</strong> — oscilación rítmica de escala u opacidad.</li>
          <li><strong>Morph</strong> — interpolación de forma o camino a lo largo del tiempo.</li>
          <li><strong>Giro</strong> — rotación constante o variable.</li>
        </ul>
        <p>
          Las animaciones tienen desfase de fase por celda o por capa para que el patrón se sienta orgánico en lugar de mecánico. Los controles de reproducción permiten pausar, reiniciar o desplazarse por la línea de tiempo global. Como la animación se genera, la composición permanece ligera y se puede compartir como parámetros en lugar de un archivo de vídeo.
        </p>

        <h2>Composición multi-capa</h2>
        <p>
          Las capas se apilan unas sobre otras con opacidad y modos de mezcla independientes. Puedes construir un patrón base y luego añadir capas de acento, superposiciones de partículas o decoraciones impulsadas por simetría sin aplanar todo. Un límite modesto de capas (alrededor de seis) mantiene predecible el coste de memoria y dibujo.
        </p>
        <p>
          Cada capa puede tener su propio conjunto de baldosas, paleta de color y temporización de animación, dándote profundidad compositiva genuina mientras permanece totalmente interactiva.
        </p>

        <h2>Modos de simetría</h2>
        <p>
          La simetría multiplica cada colocación:
        </p>
        <ul>
          <li><strong>Espejo</strong> — reflexión a través de uno o ambos ejes.</li>
          <li><strong>Radial</strong> — copias rotacionales alrededor del centro.</li>
        </ul>
        <p>
          Como la simetría se aplica en el momento del estampado (o como una transformación en vivo), los datos subyacentes permanecen simples. Puedes desactivar la simetría y editar celdas individuales después si quieres romper el patrón intencionalmente.
        </p>

        <h2>Biblioteca de baldosas</h2>
        <p>
          La biblioteca contiene varias familias:
        </p>
        <ul>
          <li>Geométricas — polígonos, cuadrículas, líneas, arcos.</li>
          <li>Orgánicas — blobs, curvas, formas suaves.</li>
          <li>Partículas — emisores pequeños o nubes de puntos que animan.</li>
          <li>Variantes hex y blob para empaquetado más ajustado o formas fluidas.</li>
        </ul>
        <p>
          Cada baldosa es una definición procedural ligera en lugar de un mapa de bits, por lo que se puede recolorar, escalar y animar en tiempo de ejecución. Añadir un nuevo tipo de baldosa no aumenta el tamaño de las composiciones guardadas.
        </p>

        <h2>Paletas de color y gradientes</h2>
        <p>
          Las paletas permiten recolorar una capa entera o una selección al instante. Los gradientes se pueden aplicar a través de la cuadrícula o dentro de baldosas individuales. Como los colores se almacenan como parámetros, cambiar la paleta actualiza cada baldosa afectada sin redibujar desde cero. Esto es especialmente útil cuando quieres varias variaciones de la misma estructura.
        </p>

        <h2>Reproducción, pincel y edición</h2>
        <p>
          Los controles de reproducción global (reproducir/pausar, velocidad, bucle) afectan a todas las baldosas animadas. El control de tamaño de pincel determina cuántas celdas cubre un clic o arrastre. El modo borrar elimina baldosas del área del pincel. Combinados con el aislamiento de capas, estas herramientas hacen posible tanto la exploración rápida como el refinamiento preciso.
        </p>

        <h2>Compartir, deep links y persistencia</h2>
        <p>
          La exportación PNG hornea el fotograma actual junto con un título, el branding de UtiliHub y un recuento de baldosas para que la imagen sea autoexplicativa al compartir. El deep-link por URL codifica la configuración esencial (baldosas activas, capas, paleta, simetría, estado de animación) para que cualquiera que abra el enlace reconstruya la composición. La persistencia automática en localStorage guarda el trabajo en el navegador para que puedas salir y volver sin perder el progreso.
        </p>

        <h2>Distinción del neon freehand</h2>
        <p>
          El Neon Layer Composer es un canvas freehand con trazos continuos, bloom y emisores de partículas. El Compositor de Patrones Modulares es basado en cuadrícula y modular: las colocaciones son discretas, repetibles y animadas por reglas procedurales en lugar de caminos freehand. Uno es mejor para el dibujo expresivo; el otro es mejor para sistemas, patrones y estructuras generativas que necesitan permanecer editables y compartibles como datos.
        </p>

        <h2>Consejos prácticos de composición</h2>
        <ul>
          <li>Empieza con una capa base geométrica simple, luego añade una capa orgánica o de partículas encima.</li>
          <li>Usa simetría radial para resultados tipo mandala; espejo para patrones arquitectónicos o textiles.</li>
          <li>Desfasa las fases de animación para que las baldosas vecinas no pulsen en perfecta unisonancia.</li>
          <li>Mantén el número de capas modesto en móvil; el payoff visual viene de la elección inteligente de baldosas más que de apilar muchas capas.</li>
          <li>Exporta un PNG pronto y a menudo — el título horneado y el recuento de baldosas hacen la imagen útil incluso fuera de la herramienta.</li>
        </ul>

        <h2>Rendimiento y Core Web Vitals</h2>
        <p>
          La cuadrícula está limitada (12×12), las capas están limitadas y el canvas se carga de forma perezosa en su propia ruta. Las animaciones usan matemáticas procedurales simples en lugar de shaders pesados o texturas grandes. No se introducen dependencias pesadas nuevas. El resultado permanece seguro para CWV en móvil mientras sigue entregando movimiento interactivo en vivo.
        </p>

        <h2>Cómo el Compositor de Patrones Modulares de UtiliHub implementa estas ideas</h2>
        <p>
          El componente almacena un mapa disperso de celda → referencias de baldosa más metadatos de capa. Cada fotograma de animación:
        </p>
        <ol>
          <li>Actualiza los parámetros procedurales (fase, offset de flujo, escala de pulso) para cada baldosa activa.</li>
          <li>Aplica las transformaciones de simetría al dibujar.</li>
          <li>Compone las capas con su mezcla y opacidad.</li>
          <li>Renderiza el fotograma final al canvas para visualización y para exportación PNG.</li>
        </ol>
        <p>
          Los parámetros de URL y localStorage mantienen la composición restaurable. Las rutas en inglés y español se mantienen sincronizadas. Adsterra permanece intacto en la página.
        </p>

        <h2>Ejemplo trabajado: Mandala radial fluida</h2>
        <p>
          Empieza con una capa de simetría radial usando arcos geométricos y una animación de giro lento. Añade una segunda capa con blobs orgánicos en una animación de flujo, ligeramente desfasada en fase. Aplica una paleta de gradiente complementaria. El resultado es un mandala vivo que se puede pausar, recolorar y compartir vía PNG o deep link en segundos.
        </p>

        <h2>Experiencias relacionadas</h2>
        <ul>
          <li><Link to="/es/neon-layer-composer">Neon Layer Composer</Link> — dibujo neon multi-capa freehand.</li>
          <li><Link to="/es/n-body-gravity">N-body Gravity</Link> — simulación de física multi-cuerpo.</li>
          <li><Link to="/es/aurora">Aurora Particle Playground</Link> — canvas de partículas abierto.</li>
          <li><Link to="/es/guias/n-body-gravity">Guía de N-body Gravity</Link> — guía companion de largo formato.</li>
        </ul>

        <h2>Preguntas frecuentes</h2>
        <p>
          <strong>¿Puedo romper la cuadrícula después?</strong> Sí. Una vez colocadas las baldosas puedes borrar celdas individuales o desactivar la simetría y editar libremente. La cuadrícula es una ayuda de colocación, no una restricción permanente.
        </p>
        <p>
          <strong>¿Las animaciones se hornean en el PNG?</strong> El PNG captura el fotograma actual (más título y branding). Las animaciones en vivo continúan en el navegador y se restauran vía el deep link.
        </p>
        <p>
          <strong>¿Algo sale del navegador?</strong> No. La persistencia es localStorage; el compartir es vía parámetros de URL o un PNG del lado del cliente.
        </p>
        <p>
          <strong>¿En qué se diferencia de un generador de patrones normal?</strong> La mayoría de generadores son de un solo uso. Aquí puedes editar, estratificar, animar y compartir el estado exacto, luego volver más tarde y continuar.
        </p>
        <p>
          <strong>¿Funcionará en móvil?</strong> Sí. Los límites de cuadrícula y capas mantienen el coste modesto. El pincel y la simetría reducen el número de toques precisos necesarios.
        </p>
        <p>
          <strong>¿Puedo exportar solo una capa?</strong> El PNG captura el fotograma compuesto actual. Puedes ocultar capas temporalmente (opacidad 0) antes de exportar para aislar una, luego restaurar.
        </p>
        <p>
          <strong>¿Cómo comparto una composición con un amigo?</strong> Usa la exportación PNG para una imagen estática, o copia la URL (deep-link) para que abran el mismo estado editable exacto. El deep-link restaura baldosas, capas, paleta y ajustes de animación.
        </p>

        <p className="mt-8">
          <Link to="/es/modular-pattern-composer" className="font-semibold text-primary">
            Abre el Compositor de Patrones Modulares y empieza a componer →
          </Link>
        </p>
      </article>
      <div className="mt-10">
        <AdsterraBanner />
      </div>
    </div>
  );
}
