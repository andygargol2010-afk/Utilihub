// Part 2 of 3 — split from IcsEventTool.tsx on 2026-11-04. Edit here; IcsEventTool.tsx re-exports.
import { allDayPreset, meetingPreset, weeklyPreset, type IcsInput } from "@/lib/general/ics-event";

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const PRESETS: { id: string; label: string; labelEs: string; draft: () => IcsInput }[] = [
  { id: "meeting", label: "1.5 h meeting", labelEs: "Reunión de 1,5 h", draft: meetingPreset },
  { id: "day", label: "All-day marker", labelEs: "Día completo", draft: allDayPreset },
  { id: "weekly", label: "Weekly standup", labelEs: "Standup semanal", draft: weeklyPreset },
];
