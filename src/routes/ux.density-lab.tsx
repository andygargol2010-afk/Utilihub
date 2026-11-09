import { createFileRoute } from "@tanstack/react-router";
import { DensityLab } from "@/components/ux/DensityLab";

export const Route = createFileRoute("/ux/density-lab")({
  head: () => ({
    meta: [
      { title: "Density Lab | UtiliHub" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "UX density experiment. Not for indexing." },
    ],
  }),
  component: DensityLabPage,
});

function DensityLabPage() {
  return <DensityLab locale="en" />;
}
