// Part 1 of 3 — split from tool-showcase.ts on 2026-11-04. Edit here; tool-showcase.ts re-exports.

/** Premium presentation config for high-traffic tools (Day 1: image suite).
 *  Redeploy trigger: ensure hero + MediaTool premium UI are on production.
 *  pixelihub-promote-v1: studio showcase for discovery.
 */

export type ToolShowcase = {
  badge: string;
  badgeEs: string;
  titleHighlight?: string;
  tagline: string;
  taglineEs: string;
  fromLabel?: string;
  toLabel?: string;
  accent: "blue" | "violet" | "emerald" | "amber" | "rose" | "cyan";
  visual?: "convert" | "compress" | "resize" | "crop" | "rotate" | "filter" | "favicon" | "pixel";
};
