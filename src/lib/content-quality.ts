/**
 * Which tool pages are worth indexing.
 *
 * Every catalog tool gets a page, but most of them only carry the generic template (the
 * one-line summary, the default "how to use it" steps and the default FAQ). Hundreds of
 * near-identical template pages are what Google's quality systems and the AdSense review
 * treat as "low value content", so pages without their own guide text are served with
 * `noindex, follow` and left out of the sitemap. They stay reachable and fully usable;
 * a page becomes indexable again automatically as soon as it gets its own guide copy
 * (a tool-seo override, a finance SEO block or a reference table).
 *
 * To switch the rule off, set MIN_OWN_GUIDE_WORDS to 0.
 */
import { toolReference } from "./tool-reference";

/** Words of tool-specific guide text a page needs to be indexed. */
export const MIN_OWN_GUIDE_WORDS = 80;

/** A step / FAQ question / about sentence used by more tools than this is template text. */
const TEMPLATE_MIN_TOOLS = 6;

/** Large interactive tools (3D studios, advanced editors) are substantial content by themselves. */
const ALWAYS_INDEX_CATEGORIES = new Set(["herramientas-avanzadas"]);
const ALWAYS_INDEX_SLUGS = new Set(["modelador-casas-3d", "modelador-3d"]);

/** Reference tables and worked examples (src/lib/tool-reference) count as substantial content. */
const REFERENCE_WORDS = 150;

type Faq = { q: string; a: string };

export type QualityTool = {
  slug: string;
  category?: string;
  summary?: string;
  about?: string[];
  steps?: string[];
  faq?: Faq[];
};

export type QualityGuide = {
  about: string[];
  steps: string[];
  faq: Faq[];
  aboutEs?: string[];
  stepsEs?: string[];
  faqEs?: Faq[];
};

export type FinanceQualityBlock = {
  intro?: string;
  introEs?: string;
  about?: string[];
  aboutEs?: string[];
  steps?: string[];
  stepsEs?: string[];
  faq?: Faq[];
  faqEs?: Faq[];
};

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;
const wordsOf = (items: ReadonlyArray<string | Faq> | undefined) =>
  (items ?? []).reduce((n, item) => n + countWords(typeof item === "string" ? item : `${item.q} ${item.a}`), 0);

type TemplateIndex = { about: Map<string, number>; steps: Map<string, number>; faq: Map<string, number> };
let templateCache: { source: readonly QualityTool[]; index: TemplateIndex } | null = null;

/** How many catalog tools use each about sentence, step and FAQ question (memoised per catalog). */
function templateIndex(allTools: readonly QualityTool[]): TemplateIndex {
  if (templateCache?.source === allTools) return templateCache.index;
  const index: TemplateIndex = { about: new Map(), steps: new Map(), faq: new Map() };
  const bump = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
  for (const tool of allTools) {
    for (const s of new Set(tool.about ?? [])) bump(index.about, s);
    for (const s of new Set(tool.steps ?? [])) bump(index.steps, s);
    for (const q of new Set((tool.faq ?? []).map((f) => f.q))) bump(index.faq, q);
  }
  templateCache = { source: allTools, index };
  return index;
}

/** Words of guide text written for this tool (template sentences excluded). */
export function ownGuideWords(
  tool: QualityTool,
  guide: QualityGuide,
  locale: "en" | "es",
  allTools: readonly QualityTool[],
): number {
  const reference = toolReference(tool.slug) ? REFERENCE_WORDS : 0;
  if (locale === "es") {
    // Spanish pages without curated copy render a generic fallback, so only overrides count.
    return wordsOf(guide.aboutEs) + wordsOf(guide.stepsEs) + wordsOf(guide.faqEs) + reference;
  }
  const t = templateIndex(allTools);
  const own = (map: Map<string, number>, key: string) => (map.get(key) ?? 0) < TEMPLATE_MIN_TOOLS;
  const about = guide.about.filter((s) => s !== tool.summary && own(t.about, s));
  const steps = guide.steps.filter((s) => own(t.steps, s));
  const faq = guide.faq.filter((f) => own(t.faq, f.q));
  return wordsOf(about) + wordsOf(steps) + wordsOf(faq) + reference;
}

export function isIndexableTool(
  tool: QualityTool,
  guide: QualityGuide,
  locale: "en" | "es",
  allTools: readonly QualityTool[],
): boolean {
  if (ALWAYS_INDEX_SLUGS.has(tool.slug) || ALWAYS_INDEX_CATEGORIES.has(tool.category ?? "")) return true;
  return ownGuideWords(tool, guide, locale, allTools) >= MIN_OWN_GUIDE_WORDS;
}

/** Finance calculators: their own copy lives in the finance SEO blocks. */
export function isIndexableFinance(block: FinanceQualityBlock | undefined, locale: "en" | "es"): boolean {
  if (!block) return MIN_OWN_GUIDE_WORDS <= 0;
  const words =
    locale === "es"
      ? countWords(block.introEs ?? "") + wordsOf(block.aboutEs) + wordsOf(block.stepsEs) + wordsOf(block.faqEs)
      : countWords(block.intro ?? "") + wordsOf(block.about) + wordsOf(block.steps) + wordsOf(block.faq);
  return words >= MIN_OWN_GUIDE_WORDS;
}
