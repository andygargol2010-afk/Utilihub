import { createFileRoute } from "@tanstack/react-router";
import { TimelineEventComposer } from "@/components/studio/TimelineEventComposer";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/studio/timeline-composer")({
  head: () => ({
    meta: [
      { title: `Timeline Event Composer | ${SITE_NAME}` },
      { name: "description", content: "Interactive timeline event composer. Add and reorder events, see a live vertical SVG timeline." },
      { property: "og:title", content: `Timeline Event Composer | ${SITE_NAME}` },
      { property: "og:url", content: absoluteUrl("/studio/timeline-composer") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/studio/timeline-composer") }],
  }),
  component: () => <TimelineEventComposer locale="en" />,
});
