import { makeTool } from "./types";

/** Gap: cron helper explains schedules. This writes a robots.txt with path checks. */
export const ROBOTS_TXT_TOOLS = [
  makeTool(
    "generador-robots-txt",
    "robots.txt generator",
    "desarrollo",
    "generator",
    "Build a robots.txt with user-agent groups, allow and disallow rules, sitemap, and a local path check.",
    [
      "robots.txt generator",
      "create robots.txt",
      "disallow admin robots",
      "block AI crawlers robots.txt",
      "sitemap robots.txt",
      "generador de robots.txt",
      "crear robots.txt",
      "bloquear rastreadores",
      "disallow admin",
      "robots.txt sitemap",
    ],
    {
      mode: "robots-txt-generator",
      title: "robots.txt Generator — Allow and Block Crawlers | UtiliHub",
      description:
        "Build a robots.txt with user-agent groups, Allow and Disallow paths, crawl-delay, and a sitemap. Check a path locally. Free, in the browser.",
    },
  ),
];
