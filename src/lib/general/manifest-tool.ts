import { makeTool } from "./types";

/** Gap: Open Graph tags a page. robots.txt and security.txt are crawler files. Neither is an installable web app manifest. */
export const MANIFEST_TOOLS = [
  makeTool(
    "generador-manifest-pwa",
    "PWA manifest generator",
    "desarrollo",
    "generator",
    "Build a web app manifest from name, start URL, display mode, and colors. Empty name does not invent a file.",
    [
      "web app manifest generator",
      "pwa manifest.json generator",
      "manifest.webmanifest online",
      "generate pwa manifest",
      "generador manifest pwa",
      "generador manifest.webmanifest",
      "crear manifest json pwa",
      "generador de manifest para pwa",
    ],
    {
      mode: "manifest-pwa",
      title: "PWA Manifest Generator — web app manifest | UtiliHub",
      description:
        "Generate a W3C web app manifest with name, start URL, display, and colors. Empty or invalid fields do not invent a file. Runs locally in the browser.",
    },
  ),
];
