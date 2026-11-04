import { type WorkKit } from "./work-kits.part1";
import { WORK_KITS } from "./work-kits.part2";
export type { WorkKit } from "./work-kits.part1";
export { WORK_KITS } from "./work-kits.part2";

/** Resolve by Spanish slug, English public slug, or legacy alias. */
export function kitBySlug(slug: string) {
  return (
    WORK_KITS.find((kit) => kit.slug === slug) ??
    WORK_KITS.find((kit) => kit.englishSlug === slug)
  );
}

export function kitEnglishPath(kit: WorkKit) {
  return `/kits/${kit.englishSlug}`;
}

export function kitSpanishPath(kit: WorkKit) {
  return `/es/kits/${kit.slug}`;
}
