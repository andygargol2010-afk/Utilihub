import { type CitationInput, type CitationResult, clean } from "./apa-citation.part1";
import { formatAuthorList, formatApaDate, normalizeUrl } from "./apa-citation.part2";
export { formatAuthorName } from "./apa-citation.part1";
export type { CitationKind, CitationInput, CitationResult } from "./apa-citation.part1";
export { formatAuthorList, formatApaDate } from "./apa-citation.part2";

export function buildCitation(input: CitationInput, es: boolean): CitationResult {
  const title = clean(input.title);
  if (!title) return { status: "empty" };
  const authors = formatAuthorList(input.authors, es);
  const date = formatApaDate(input.year, input.month, input.day, es);
  const container = clean(input.container);
  const { url, warning } = normalizeUrl(input.url);
  const volume = clean(input.volume);
  const issue = clean(input.issue);
  const pages = clean(input.pages).replace(/\s*-\s*/g, "–");

  const head = authors ? `${authors}. (${date}).` : `${title}. (${date}).`;
  const work = authors ? title : "";

  if (input.kind === "book") {
    const parts = [head, work && `${work}.`, container && `${container}.`].filter(Boolean);
    return { status: "ok", citation: parts.join(" ").replace(/\s+/g, " "), warning: url ? warning : null };
  }

  if (input.kind === "journal") {
    const vol = volume ? (issue ? `${volume}(${issue})` : volume) : "";
    const loc = [vol, pages].filter(Boolean).join(", ");
    const parts = [
      head,
      work && `${work}.`,
      container && `${container}${loc ? `, ${loc}` : ""}.`,
      !container && loc && `${loc}.`,
      url,
    ].filter(Boolean);
    return { status: "ok", citation: parts.join(" ").replace(/\s+/g, " "), warning };
  }

  const parts = [head, work && `${work}.`, container && `${container}.`, url].filter(Boolean);
  return { status: "ok", citation: parts.join(" ").replace(/\s+/g, " "), warning };
}

export const APA_PRESETS: { id: string; input: CitationInput }[] = [
  {
    id: "web",
    input: {
      kind: "webpage",
      authors: "IPCC",
      year: "2024",
      month: "3",
      day: "20",
      title: "Climate report",
      container: "UN",
      volume: "",
      issue: "",
      pages: "",
      url: "https://example.org/report",
    },
  },
  {
    id: "book",
    input: {
      kind: "book",
      authors: "García Márquez, Gabriel",
      year: "1967",
      month: "",
      day: "",
      title: "Cien años de soledad",
      container: "Sudamericana",
      volume: "",
      issue: "",
      pages: "",
      url: "",
    },
  },
];
