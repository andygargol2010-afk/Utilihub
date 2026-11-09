// Part 2 of 3 — split from robots-txt.ts on 2026-11-04. Edit here; robots-txt.ts re-exports.
import { type RobotsDraft, type RobotsIssue } from "./robots-txt.part1";

export function parseDelay(value: string): number | null | "bad" {
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
