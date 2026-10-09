import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { kitBoardStorageKey } from "@/components/kits/KitDeskTrail";
import { WORK_KITS, kitEnglishPath, kitSpanishPath, type WorkKit } from "@/lib/work-kits";

type KitReturnRibbonProps = {
  toolSlug: string;
  locale?: "en" | "es";
};

type StoredBoard = { note?: string; done?: string[] };

type RibbonState =
  | { status: "pending" }
  | { status: "absent" }
  | { status: "idle"; kit: WorkKit }
  | { status: "link"; kit: WorkKit; done: number };

function boardActivity(raw: string | null): { active: boolean; done: number } {
  if (!raw) return { active: false, done: 0 };
  try {
    const parsed = JSON.parse(raw) as StoredBoard;
    const done = Array.isArray(parsed.done) ? parsed.done.filter((item) => typeof item === "string").length : 0;
    const note = typeof parsed.note === "string" && parsed.note.trim().length > 0;
    return { active: done > 0 || note, done };
  } catch {
    return { active: false, done: 0 };
  }
}

export function KitReturnRibbon({ toolSlug, locale = "en" }: KitReturnRibbonProps) {
  const es = locale === "es";
  const [state, setState] = useState<RibbonState>({ status: "pending" });

  useEffect(() => {
    const matches = WORK_KITS.filter((kit) => kit.toolSlugs.includes(toolSlug));
    if (!matches.length) {
      setState({ status: "absent" });
      return;
    }
    let idleKit = matches[0];
    for (const kit of matches) {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(kitBoardStorageKey(kit.slug));
      } catch {
        raw = null;
      }
      const activity = boardActivity(raw);
      if (activity.active) {
        setState({ status: "link", kit, done: activity.done });
        return;
      }
    }
    setState({ status: "idle", kit: idleKit });
  }, [toolSlug]);

  if (state.status === "pending" || state.status === "absent") return null;

  const href = es ? kitSpanishPath(state.kit) : kitEnglishPath(state.kit);
  if (state.status === "idle") {
    return (
      <p className="mt-3 text-xs text-muted-foreground" data-kit-return="idle">
        {es ? "Este paso está en un kit. La pizarra sigue vacía en este navegador." : "This step is in a kit. The board is still empty in this browser."}
      </p>
    );
  }

  return (
    <p className="mt-3 text-sm" data-kit-return={href}>
      <a href={href} className="inline-flex items-center gap-1.5 font-bold text-primary">
        <ArrowLeft className="size-4" />
        {es ? `Volver al kit · ${state.done} marcados` : `Back to kit · ${state.done} checked`}
      </a>
    </p>
  );
}
