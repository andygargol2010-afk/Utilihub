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

function parseDelay(value: string): number | null | "bad" {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return "bad";
  return n;
}

export function validateDraft(draft: RobotsDraft, es: boolean): RobotsIssue[] {
  const issues: RobotsIssue[] = [];
  if (!draft.groups.length) {
    issues.push({ field: "groups", message: es ? "Agregá al menos un user-agent." : "Add at least one user-agent." });
  }
  draft.groups.forEach((group, index) => {
    if (!group.agent.trim()) {
      issues.push({
        field: `agent-${group.id}`,
        message: es ? `El grupo ${index + 1} no tiene user-agent.` : `Group ${index + 1} is missing a user-agent.`,
      });
    }
    const delay = parseDelay(group.crawlDelay);
    if (delay === "bad" || (typeof delay === "number" && delay < 0)) {
      issues.push({
        field: `delay-${group.id}`,
        message: es
          ? `Crawl-delay del grupo ${index + 1} debe ser un número ≥ 0 o quedar vacío.`
          : `Crawl-delay in group ${index + 1} must be a number ≥ 0, or stay empty.`,
      });
    }
    if (!group.rules.length) {
      issues.push({
        field: `rules-${group.id}`,
        message: es ? `El grupo ${index + 1} no tiene reglas.` : `Group ${index + 1} has no rules.`,
      });
    }
    group.rules.forEach((rule) => {
      const path = rule.path.trim();
      if (!path.startsWith("/")) {
        issues.push({
          field: `path-${rule.id}`,
          message: es
            ? `La ruta "${path || "(vacía)"}" debe empezar con /.`
            : `Path "${path || "(empty)"}" must start with /.`,
        });
      }
    });
  });
  const sitemap = draft.sitemap.trim();
  if (sitemap) {
    try {
      const url = new URL(sitemap);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("protocol");
    } catch {
      issues.push({
        field: "sitemap",
        message: es ? "El sitemap debe ser una URL http o https." : "Sitemap must be an http or https URL.",
      });
    }
  }
  return issues;
}

function patternToRegExp(pattern: string): RegExp {
  let source = "^";
  for (const ch of pattern) {
    if (ch === "*") source += ".*";
    else if (ch === "$") source += "$";
    else source += ch.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  }
  if (!pattern.endsWith("$")) source += ".*";
  return new RegExp(source);
}

export function pathDecision(group: RobotsGroup, path: string): "allow" | "disallow" | "default" {
  const target = path.trim() || "/";
  let best: { length: number; directive: RobotsDirective } | null = null;
  for (const rule of group.rules) {
    const pattern = rule.path.trim();
    if (!pattern.startsWith("/")) continue;
    if (!patternToRegExp(pattern).test(target.startsWith("/") ? target : `/${target}`)) continue;
    if (!best || pattern.length > best.length || (pattern.length === best.length && rule.directive === "Allow")) {
      best = { length: pattern.length, directive: rule.directive };
    }
  }
  if (!best) return "default";
  return best.directive === "Allow" ? "allow" : "disallow";
}

export function buildRobotsTxt(draft: RobotsDraft): string {
  const lines: string[] = [];
  const comment = draft.comment.trim();
  if (comment) {
    for (const line of comment.split(/\r?\n/)) lines.push(`# ${line}`);
    lines.push("");
  }
  draft.groups.forEach((group, index) => {
    if (index > 0) lines.push("");
    lines.push(`User-agent: ${group.agent.trim()}`);
    const delay = parseDelay(group.crawlDelay);
    if (typeof delay === "number") lines.push(`Crawl-delay: ${delay}`);
    for (const rule of group.rules) lines.push(`${rule.directive}: ${rule.path.trim()}`);
  });
  const sitemap = draft.sitemap.trim();
  if (sitemap) {
    lines.push("");
    lines.push(`Sitemap: ${sitemap}`);
  }
  return `${lines.join("\n")}\n`;
}
