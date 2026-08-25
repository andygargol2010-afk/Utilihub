export const SITE_URL = "https://utilihub-ten.vercel.app";
export const SITE_NAME = "UtiliHub";
export const DEFAULT_DESCRIPTION = "Herramientas online gratuitas, rápidas y sin registro: calculadoras, conversores, utilidades educativas y herramientas para trabajar directamente desde el navegador.";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const ogImage = () => absoluteUrl("/og-image.svg");

export const cleanDescription = (value: string, max = 160) => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
};

export const toolKeywords = (tool: { name: string; keywords?: string[]; category?: string }) =>
  Array.from(new Set([tool.name, ...(tool.keywords ?? []), tool.category ?? "herramientas online", "UtiliHub"]));

export const webApplicationSchema = (tool: { name: string; description: string; slug: string }) => ({
  "@type": "WebApplication",
  name: tool.name,
  description: tool.description,
  url: absoluteUrl(`/herramientas/${tool.slug}`),
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
});

export const breadcrumbSchema = (items: Array<{ name: string; path?: string }>) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    ...(item.path ? { item: absoluteUrl(item.path) } : {}),
  })),
});

export const faqSchema = (faq: Array<{ q: string; a: string }>) => ({
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});
