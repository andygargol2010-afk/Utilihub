import { createFileRoute } from "@tanstack/react-router";
import { FocusLane } from "@/components/ux/FocusLane";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/ux/carril-foco")({
  head: () => ({
    meta: [
      { title: `Carril de foco | ${SITE_NAME}` },
      {
        name: "description",
        content: "Experimento UX: numera los controles tabulables mientras el carril de foco está encendido.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/ux/carril-foco` }],
  }),
  component: CarrilFocoPage,
});

function CarrilFocoPage() {
  return <FocusLane locale="es" />;
}
