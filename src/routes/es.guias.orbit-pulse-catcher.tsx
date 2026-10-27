import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { absoluteUrl, cleanDescription, ogImage, SITE_NAME, hreflangLinks } from "@/lib/seo";

const title = "Atrapa Pulsos en Órbita: Guía del Juego de Timing Radial | UtiliHub";
const description = cleanDescription(
  "Guía original de largo formato sobre el juego interactivo Atrapa Pulsos en Órbita. Explica mecánicas de órbita radial, coincidencia de zonas que crecen hasta 8, multiplicadores de combo, pulsos de power-up, ráfagas de partículas, feedback háptico, zonas táctiles amplias, controles de teclado, compartir PNG con branding y estadísticas, y high scores en localStorage. Incluye fórmula exacta de puntuación, progresión de niveles, ventanas de timing, estrategias, patrones de ritmo, errores comunes, técnicas avanzadas y recuperación, drills de práctica estructurados, un plan de sesión de 15 minutos para high score, distinción de otros juegos de pulsos y enlaces profundos a la experiencia en vivo.",
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
          Atrapa Pulsos en Órbita es un juego interactivo de timing construido alrededor de mecánicas de órbita radial. Los pulsos viajan a lo largo de órbitas circulares mientras las zonas de coincidencia crecen desde unas pocas hasta ocho. Atrápalos en el momento correcto para construir combos, activar power-ups y perseguir puntuaciones altas. Esta guía original cubre el bucle principal, los sistemas de puntuación, el feedback visual y háptico, los controles, el compartir, la persistencia, estrategias prácticas, patrones de ritmo, errores comunes, fórmula exacta y progresión, técnicas avanzadas, drills de práctica estructurados, un plan de sesión de high score y cómo se diferencia de otras experiencias de pulsos y arcade en UtiliHub.
        </p>

        <div className="not-prose my-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold">Juega la experiencia en vivo</h3>
          <p className="mt-2 text-muted-foreground">
            Coincide pulsos en órbitas radiales, haz crecer tu combo y comparte tu mejor puntuación.
          </p>
          <Link to="/es/juegos/atrapa-pulsos-orbita" className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Abrir Atrapa Pulsos en Órbita
          </Link>
        </div>

        <h2>Fórmula exacta de puntuación y ejemplos trabajados</h2>
        <p>pts = 24 × (1 + (combo − 1) × 0.4) × (1 + nivel × 0.15) × multiplicador</p>
        <p>Multiplicador 1.8 con boost activo. Combo crece si captura dentro de 1.1 s; se reinicia tras fallo o >1.6 s.</p>
        <p><strong>Ejemplo:</strong> Nivel 4, combo 8, boost: ~263 pts.</p>

        <h2>Progresión de niveles y zonas</h2>
        <ul>
          <li>Niveles 1–2: 4 zonas</li>
          <li>Niveles 3–4: 5 zonas</li>
          <li>Niveles 5–6: 6 zonas</li>
          <li>Niveles 7–8: 7 zonas</li>
          <li>Niveles 9+: 8 zonas</li>
        </ul>

        <h2>Técnicas avanzadas y drills</h2>
        <p>Lidera entradas de zona 50–80 ms. Prioriza cadena de combo en multi-pulso. Drills: warm-up de zonas, lead-and-hold, escalera de recuperación, timing de power-up. Plan de 15 min: warm-up → lead → recuperación+boost → partida completa + PNG.</p>

        <h2>Errores comunes</h2>
        <ul>
          <li>Perseguir clips de borde una vez >5 zonas.</li>
          <li>Retener power-ups demasiado.</li>
          <li>Pánico tras casi-fallo.</li>
          <li>No exportar PNG.</li>
        </ul>

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
