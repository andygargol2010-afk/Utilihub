import { createFileRoute } from "@tanstack/react-router";
import { DensityLab } from "@/components/ux/DensityLab";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/es/ux/laboratorio-densidad")({
  head: () => ({
    meta: [
      { title: `Laboratorio de densidad | ${SITE_NAME}` },
      {
        name: "description",
        content: "Experimento UX: cambiá la densidad de layout de una lista de tarjetas de muestra. La elección persiste en este navegador.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/es/ux/laboratorio-densidad` }],
  }),
  component: LaboratorioDensidadPage,
});

function LaboratorioDensidadPage() {
  return <DensityLab locale="es" />;
}
