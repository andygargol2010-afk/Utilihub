// Part 2 of 3 — split from RobotsTxtTool.tsx on 2026-11-04. Edit here; RobotsTxtTool.tsx re-exports.
import { allowAllDraft, blockAiDraft, blockAllDraft, publicSiteDraft, type RobotsDraft } from "@/lib/general/robots-txt";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const PRESETS: { id: string; label: string; labelEs: string; draft: () => RobotsDraft }[] = [
  { id: "allow", label: "Allow all", labelEs: "Permitir todo", draft: allowAllDraft },
  { id: "block", label: "Block all", labelEs: "Bloquear todo", draft: blockAllDraft },
  { id: "public", label: "Public site", labelEs: "Sitio público", draft: publicSiteDraft },
  { id: "ai", label: "Block AI crawlers", labelEs: "Bloquear bots de IA", draft: blockAiDraft },
];
