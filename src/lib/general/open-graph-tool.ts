import { makeTool } from "./types";

/** Gap: UTM builds a campaign URL. This emits og:* and twitter:* tags and does not fetch the image. */
export const OPEN_GRAPH_TOOLS = [
  makeTool(
    "generador-open-graph",
    "Open Graph tag generator",
    "desarrollo",
    "generator",
    "Build Open Graph and Twitter card meta tags in the browser, with length and absolute-URL checks.",
    [
      "open graph meta tag generator",
      "twitter card meta tags",
      "generador open graph",
      "meta tags para redes",
      "og:image absolute url",
    ],
    {
      mode: "open-graph",
      title: "Open Graph Tag Generator — Twitter Cards, Local | UtiliHub",
      description:
        "Build og:title, og:description, og:image, and twitter:card tags in the browser. A 13-character title stays under the 60-character soft limit. Images are not fetched.",
    },
  ),
];
