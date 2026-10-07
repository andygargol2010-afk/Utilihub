import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_APA: Record<string, ToolSeoOverride> = {
  "generador-cita-apa": {
    metaTitle: "APA 7 Citation Generator — Webpage, Book, Journal | UtiliHub",
    metaTitleEs: "Generador de citas APA 7 — web, libro y artículo | UtiliHub",
    metaDescription:
      "Build an APA 7th reference for a webpage, book, or journal. García Márquez, G. (1967) and IPCC (2024, March 20) stay in the browser.",
    metaDescriptionEs:
      "Armá una referencia APA 7 para una web, un libro o un artículo. García Márquez, G. (1967) e IPCC (2024, 20 de marzo) se calculan en el navegador.",
    about: [
      "Format an APA 7th edition reference for a webpage, book, or journal article. Author initials, missing dates, and the 21-author ellipsis stay in the browser.",
      "IPCC with 20 March 2024, title Climate report, site UN, and https://example.org/report becomes IPCC. (2024, March 20). Climate report. UN. https://example.org/report.",
      "García Márquez, Gabriel and 1967, title Cien años de soledad, publisher Sudamericana becomes García Márquez, G. (1967). Cien años de soledad. Sudamericana.",
    ],
    aboutEs: [
      "Formateá una referencia APA 7 para web, libro o artículo. Iniciales, fecha faltante y la elipsis de más de 20 autores se resuelven en el navegador.",
      "IPCC, 20 de marzo de 2024, título Climate report, sitio UN y https://example.org/report queda IPCC. (2024, March 20). Climate report. UN. https://example.org/report en inglés, o con fecha en español si la interfaz está en ES.",
      "García Márquez, Gabriel, 1967, Cien años de soledad y editorial Sudamericana queda García Márquez, G. (1967). Cien años de soledad. Sudamericana.",
    ],
    steps: [
      "Choose webpage, book, or journal.",
      "Enter authors (Last, First or one per line), year, title, and the site, publisher, or journal.",
      "Copy the reference. A blank year becomes n.d.; a blank title is rejected.",
    ],
    stepsEs: [
      "Elegí web, libro o artículo.",
      "Cargá autores (Apellido, Nombre o uno por línea), año, título y sitio, editorial o revista.",
      "Copiá la referencia. Sin año queda s. f.; sin título no se genera.",
    ],
    faq: [
      { q: "How do I cite a webpage in APA 7?", a: "Author. (Year, Month Day). Title. Site Name. URL. IPCC. (2024, March 20). Climate report. UN. https://example.org/report." },
      { q: "What if there is no date?", a: "The year slot becomes n.d. in English and s. f. in Spanish. A month without a year is ignored." },
      { q: "How are two authors joined?", a: "English uses & before the last name. Spanish uses y. Three to twenty authors are listed; the 21st case uses an ellipsis before the final author." },
      { q: "Does this italicize the title?", a: "The text reference is plain so it pastes into any editor. Italicize the book or webpage title in your document." },
    ],
    faqEs: [
      { q: "¿Cómo cito una página web en APA 7?", a: "Autor. (Año, día de mes). Título. Sitio. URL. En inglés: IPCC. (2024, March 20). Climate report. UN. https://example.org/report." },
      { q: "¿Qué pasa si no hay fecha?", a: "El año queda n.d. en inglés y s. f. en español. Un mes sin año se ignora." },
      { q: "¿Cómo se unen dos autores?", a: "En inglés va & antes del último. En español va y. De 3 a 20 se listan; con 21 o más hay elipsis antes del último." },
      { q: "¿El título va en cursiva?", a: "La referencia sale en texto plano para pegarla en cualquier editor. La cursiva del libro o de la web se aplica en el documento." },
    ],
  },
};
