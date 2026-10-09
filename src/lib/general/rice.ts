export type RiceKind = "white" | "basmati" | "jasmine" | "sushi" | "brown" | "parboiled";

export type RiceResult =
  | { status: "invalid"; issue: "empty" | "range"; waterMl: null; cookedG: null }
  | { status: "ok"; issue: null; waterMl: number; cookedG: number; ratio: number; yieldFactor: number };

export const RICE_KINDS: ReadonlyArray<{
  id: RiceKind;
  waterPerGram: number;
  cookedPerGram: number;
}> = [
  { id: "white", waterPerGram: 1.5, cookedPerGram: 3 },
  { id: "basmati", waterPerGram: 1.25, cookedPerGram: 2.8 },
  { id: "jasmine", waterPerGram: 1.2, cookedPerGram: 2.7 },
  { id: "sushi", waterPerGram: 1.1, cookedPerGram: 2.4 },
  { id: "brown", waterPerGram: 2, cookedPerGram: 2.5 },
  { id: "parboiled", waterPerGram: 1.75, cookedPerGram: 2.8 },
];

const KIND_BY_ID = new Map(RICE_KINDS.map((kind) => [kind.id, kind]));

export function riceWater(kindId: RiceKind, dryGrams: number): RiceResult {
  const kind = KIND_BY_ID.get(kindId);
  if (!kind || !Number.isFinite(dryGrams) || dryGrams <= 0) {
    return { status: "invalid", issue: "empty", waterMl: null, cookedG: null };
  }
  if (dryGrams > 5000) {
    return { status: "invalid", issue: "range", waterMl: null, cookedG: null };
  }
  return {
    status: "ok",
    issue: null,
    waterMl: Math.round(dryGrams * kind.waterPerGram * 10) / 10,
    cookedG: Math.round(dryGrams * kind.cookedPerGram * 10) / 10,
    ratio: kind.waterPerGram,
    yieldFactor: kind.cookedPerGram,
  };
}
