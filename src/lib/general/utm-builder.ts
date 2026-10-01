import { makeTool } from "./types";

export const UTM_BUILDER_TOOLS = [
  makeTool(
    "generador-utm",
    "UTM link builder",
    "desarrollo",
    "code",
    "Build a campaign URL with utm_source, utm_medium, utm_campaign, and optional term and content.",
    ["utm builder", "utm link", "campaign url", "generador utm", "utm_source", "google analytics"],
    {
      mode: "utm-builder",
      title: "UTM link builder free online | UtiliHub",
      description:
        "Build a trackable campaign URL with source, medium, campaign, term, and content. Free in the browser, no signup.",
    },
  ),
];
