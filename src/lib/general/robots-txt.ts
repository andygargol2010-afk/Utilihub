import { type RobotsGroup, type RobotsDirective, type RobotsDraft } from "./robots-txt.part1";
import { parseDelay } from "./robots-txt.part2";
export { emptyRule, emptyGroup, allowAllDraft, blockAllDraft, publicSiteDraft, blockAiDraft } from "./robots-txt.part1";
export type { RobotsDirective, RobotsRule, RobotsGroup, RobotsDraft, RobotsIssue } from "./robots-txt.part1";
export { validateDraft } from "./robots-txt.part2";

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
