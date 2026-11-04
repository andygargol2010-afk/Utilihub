// Part 2 of 3 — split from BinPackingSim.tsx on 2026-11-04. Edit here; BinPackingSim.tsx re-exports.

export const BIN_H = 6;

export type ItemType = {
  id: string;
  w: number;
  h: number;
  color: string;
  labelEn: string;
  labelEs: string;
};

export const ITEM_TYPES: ItemType[] = [
  { id: "s2", w: 2, h: 2, color: "#3b82f6", labelEn: "2×2", labelEs: "2×2" },
  { id: "r31", w: 3, h: 1, color: "#10b981", labelEn: "3×1", labelEs: "3×1" },
  { id: "r13", w: 1, h: 3, color: "#f59e0b", labelEn: "1×3", labelEs: "1×3" },
  { id: "s1", w: 1, h: 1, color: "#ef4444", labelEn: "1×1", labelEs: "1×1" },
  { id: "r42", w: 4, h: 2, color: "#8b5cf6", labelEn: "4×2", labelEs: "4×2" },
];

export type Placed = { id: number; type: ItemType; x: number; y: number };

export type Challenge = {
  id: string;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
  targetUtil: number;
  allowedIds?: string[];
};

export const CHALLENGES: Challenge[] = [
  {
    id: "free",
    nameEn: "Free play",
    nameEs: "Libre",
    descEn: "Any items. Maximize utilization.",
    descEs: "Cualquier pieza. Maximizá la utilización.",
    targetUtil: 0,
  },
  {
    id: "util80",
    nameEn: "80% challenge",
    nameEs: "Desafío 80%",
    descEn: "Reach at least 80% utilization.",
    descEs: "Alcanzá al menos 80% de utilización.",
    targetUtil: 80,
  },
  {
    id: "small90",
    nameEn: "Small items 90%",
    nameEs: "Pequeñas 90%",
    descEn: "Only 1×1 and 2×2. Reach 90%.",
    descEs: "Solo 1×1 y 2×2. Alcanzá 90%.",
    targetUtil: 90,
    allowedIds: ["s1", "s2"],
  },
  {
    id: "mixed70",
    nameEn: "Mixed 70%",
    nameEs: "Mixto 70%",
    descEn: "Use at least 3 different sizes. Reach 70%.",
    descEs: "Usá al menos 3 tamaños distintos. Alcanzá 70%.",
    targetUtil: 70,
  },
];

export function readBest(key: string): number | null {
  try {
    const v = localStorage.getItem(key);
    return v != null ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

export function writeBest(key: string, value: number): number {
  const prev = readBest(key);
  if (prev == null || value > prev) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      /* ignore */
    }
    return value;
  }
  return prev;
}

export function updateUrl(challengeId: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("ch", challengeId);
  window.history.replaceState(null, "", url);
}
