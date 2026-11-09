import { createFileRoute } from "@tanstack/react-router";
import { FocusLane } from "@/components/ux/FocusLane";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/ux/focus-lane")({
  head: () => ({
    meta: [
      { title: `Focus lane | ${SITE_NAME}` },
      {
        name: "description",
        content: "UX experiment: number tabbable controls while a focus lane is on.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ux/focus-lane` }],
  }),
  component: FocusLanePage,
});

function FocusLanePage() {
  return <FocusLane locale="en" />;
}
