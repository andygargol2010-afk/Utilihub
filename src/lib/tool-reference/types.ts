/** Quick-reference blocks (table, formula, worked examples) shown under a tool's guide. */
export type LocalizedText = { en: string; es: string };

export type ToolReference = {
  formula: { title: LocalizedText; lines: LocalizedText[] };
  table: {
    caption: LocalizedText;
    headers: LocalizedText[];
    rows: { en: string[]; es: string[] }[];
  };
  examples: LocalizedText[];
};

/** Internal link target with its canonical EN and ES paths. */
export type ReferenceLink = { en: string; es: string; nameEn: string; nameEs: string };
