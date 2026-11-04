// Part 1 of 3 — split from robots-txt.ts on 2026-11-04. Edit here; robots-txt.ts re-exports.

/** Build and check a robots.txt file in the browser. */
export type RobotsDirective = "Allow" | "Disallow";

export type RobotsRule = {
  id: string;
  directive: RobotsDirective;
  path: string;
};

export type RobotsGroup = {
  id: string;
  agent: string;
  crawlDelay: string;
  rules: RobotsRule[];
};

export type RobotsDraft = {
  groups: RobotsGroup[];
  sitemap: string;
  comment: string;
};

export type RobotsIssue = { field: string; message: string };

export function emptyRule(partial?: Partial<RobotsRule>): RobotsRule {
  return {
    id: partial?.id ?? Math.random().toString(36).slice(2, 8),
    directive: partial?.directive ?? "Disallow",
    path: partial?.path ?? "/",
  };
}

export function emptyGroup(partial?: Partial<RobotsGroup>): RobotsGroup {
  return {
    id: partial?.id ?? Math.random().toString(36).slice(2, 8),
    agent: partial?.agent ?? "*",
    crawlDelay: partial?.crawlDelay ?? "",
    rules: partial?.rules ?? [emptyRule({ directive: "Allow", path: "/" })],
  };
}

export function allowAllDraft(): RobotsDraft {
  return {
    groups: [emptyGroup({ agent: "*", crawlDelay: "", rules: [emptyRule({ directive: "Allow", path: "/" })] })],
    sitemap: "",
    comment: "",
  };
}

export function blockAllDraft(): RobotsDraft {
  return {
    groups: [emptyGroup({ agent: "*", rules: [emptyRule({ directive: "Disallow", path: "/" })] })],
    sitemap: "",
    comment: "Block every crawler. Use on staging.",
  };
}

export function publicSiteDraft(): RobotsDraft {
  return {
    groups: [
      emptyGroup({
        agent: "*",
        rules: [
          emptyRule({ directive: "Allow", path: "/" }),
          emptyRule({ directive: "Disallow", path: "/admin" }),
          emptyRule({ directive: "Disallow", path: "/private" }),
        ],
      }),
    ],
    sitemap: "https://www.example.com/sitemap.xml",
    comment: "",
  };
}

export function blockAiDraft(): RobotsDraft {
  return {
    groups: [
      emptyGroup({ agent: "*", rules: [emptyRule({ directive: "Allow", path: "/" })] }),
      emptyGroup({ agent: "GPTBot", rules: [emptyRule({ directive: "Disallow", path: "/" })] }),
      emptyGroup({ agent: "ClaudeBot", rules: [emptyRule({ directive: "Disallow", path: "/" })] }),
      emptyGroup({ agent: "Google-Extended", rules: [emptyRule({ directive: "Disallow", path: "/" })] }),
      emptyGroup({ agent: "CCBot", rules: [emptyRule({ directive: "Disallow", path: "/" })] }),
    ],
    sitemap: "https://www.example.com/sitemap.xml",
    comment: "Blocks common AI training crawlers. Search crawlers stay allowed.",
  };
}
