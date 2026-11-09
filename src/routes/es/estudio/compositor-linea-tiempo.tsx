import { createFileRoute } from "@tanstack/react-router";
import { TimelineEventComposer } from "@/components/studio/TimelineEventComposer";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/es/estudio/compositor-linea-tiempo")({
  head: () => ({
    meta: [
      { title: `Compositor de Línea de Tiempo | ${SITE_NAME}` },
      { name: "description", content: "Compositor interactivo de línea de tiempo. Añade y reordena eventos, ve la línea SVG en vivo." },
      { property: "og:title", content: `Compositor de Línea de Tiempo | ${SITE_NAME}` },
      { property: "og:url", content: absoluteUrl("/es/estudio/compositor-linea-tiempo") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/es/estudio/compositor-linea-tiempo") }],
  }),
  component: () => <TimelineEventComposer locale="es" />,
});
