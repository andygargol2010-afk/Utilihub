/** Build Open Graph and Twitter card meta tags. Nothing is fetched. */

export type OgType = "website" | "article";
export type TwitterCard = "summary" | "summary_large_image";
export type OgLocale = "en_US" | "es_ES";

export type OgInput = {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  type: OgType;
  card: TwitterCard;
  locale: OgLocale;
};

export type OgIssue = { field: "title" | "description" | "url" | "image"; level: "error" | "warn"; code: string };

export type OgResult = {
  html: string;
  issues: OgIssue[];
  titleLength: number;
  descriptionLength: number;
};

export const OG_TITLE_SOFT = 60;
export const OG_DESCRIPTION_SOFT = 200;

export function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function isAbsoluteHttp(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildOpenGraph(input: OgInput): OgResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const url = input.url.trim();
  const image = input.image.trim();
  const siteName = input.siteName.trim();
  const issues: OgIssue[] = [];

  if (!title) issues.push({ field: "title", level: "error", code: "title-required" });
  else if (title.length > OG_TITLE_SOFT) issues.push({ field: "title", level: "warn", code: "title-long" });

  if (!description) issues.push({ field: "description", level: "warn", code: "description-empty" });
  else if (description.length > OG_DESCRIPTION_SOFT) issues.push({ field: "description", level: "warn", code: "description-long" });

  if (url && !isAbsoluteHttp(url)) issues.push({ field: "url", level: "error", code: "url-absolute" });
  if (image && !isAbsoluteHttp(image)) issues.push({ field: "image", level: "error", code: "image-absolute" });
  if (!image && input.card === "summary_large_image") issues.push({ field: "image", level: "warn", code: "image-missing" });
  if (image.startsWith("http://")) issues.push({ field: "image", level: "warn", code: "image-http" });

  const lines: string[] = [];
  const meta = (name: string, content: string, attr: "property" | "name") => {
    if (!content) return;
    lines.push(`<meta ${attr}="${name}" content="${escapeAttr(content)}" />`);
  };
  meta("og:title", title, "property");
  meta("og:description", description, "property");
  meta("og:type", input.type, "property");
  meta("og:url", url, "property");
  meta("og:image", image, "property");
  meta("og:site_name", siteName, "property");
  meta("og:locale", input.locale, "property");
  meta("twitter:card", input.card, "name");
  meta("twitter:title", title, "name");
  meta("twitter:description", description, "name");
  meta("twitter:image", image, "name");

  return {
    html: lines.join("\n"),
    issues,
    titleLength: title.length,
    descriptionLength: description.length,
  };
}
