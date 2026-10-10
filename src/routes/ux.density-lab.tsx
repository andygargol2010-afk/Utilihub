import { createFileRoute } from "@tanstack/react-router";
import { DensityLab } from "@/components/ux/DensityLab";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/ux/density-lab")({
  head: () => ({
    meta: [
      { title: `Density lab | ${SITE_NAME}` },
      {
        name: "description",
        content: "UX experiment: switch layout density of a sample card list. Choice persists in this browser.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ux/density-lab` }],
  }),
  component: DensityLabPage,
});

function DensityLabPage() {
  return <DensityLab locale="en" />;
}
