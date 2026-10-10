import { createFileRoute } from "@tanstack/react-router";
import { DensityLab } from "@/components/ux/DensityLab";

export const Route = createFileRoute("/es/ux/laboratorio-densidad")({
  head: () => ({
    meta: [
      { title: "Laboratorio de densidad | UtiliHub" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Experimento UX de densidad. No indexar." },
    ],
  }),
  component: LaboratorioDensidadPage,
});

function LaboratorioDensidadPage() {
  return <DensityLab locale="es" />;
}
