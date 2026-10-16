/**
 * SEO-only locales beyond EN/ES.
 * Routes live under `/{code}/...` and must NOT be linked from primary EN/ES nav.
 * Keep in sync with `.agent/seo-locales-registry.md`.
 */

export type SeoLocaleDir = "ltr" | "rtl";

export type SeoLocale = {
  /** URL prefix segment, e.g. "pt" → /pt/... */
  code: string;
  /** BCP-47 tag for lang/hreflang */
  bcp47: string;
  dir: SeoLocaleDir;
  /** Human label in English for agent/docs */
  labelEn: string;
  status: "active" | "planned";
};

/** Priority order for Ideas Lab domain `seo-locales` when activating a new language. */
export const SEO_LOCALE_PRIORITY: readonly string[] = [
  "pt",
  "fr",
  "de",
  "ar",
  "hi",
  "id",
  "ja",
  "ko",
  "it",
  "nl",
] as const;

/**
 * Active SEO locales (shipped route trees).
 * Empty until the first seo-locales Ideas Lab run lands pages.
 */
export const SEO_LOCALES_ACTIVE: readonly SeoLocale[] = [
  // e.g. { code: "pt", bcp47: "pt-BR", dir: "ltr", labelEn: "Portuguese", status: "active" },
] as const;

export function seoLocaleByCode(code: string): SeoLocale | undefined {
  return SEO_LOCALES_ACTIVE.find((l) => l.code === code);
}

export function isSeoLocaleCode(code: string): boolean {
  return SEO_LOCALES_ACTIVE.some((l) => l.code === code);
}

/** Next priority code not yet active — for domain roll execution. */
export function nextSeoLocaleToActivate(): string | undefined {
  const active = new Set(SEO_LOCALES_ACTIVE.map((l) => l.code));
  return SEO_LOCALE_PRIORITY.find((c) => !active.has(c));
}
