import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildOpenGraph, type OgLocale, type OgType, type TwitterCard } from "@/lib/general/open-graph";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLE = {
  title: "Kitchen timer",
  description: "A free browser timer for cooking.",
  url: "https://utilihub.net/tools/kitchen-timer",
  image: "https://utilihub.net/og/kitchen.jpg",
  siteName: "UtiliHub",
  type: "website" as OgType,
  card: "summary_large_image" as TwitterCard,
  locale: "en_US" as OgLocale,
};

const ISSUE_COPY: Record<string, { en: string; es: string }> = {
  "title-required": { en: "Title is required.", es: "El título es obligatorio." },
  "title-long": { en: "Title is over 60 characters. Some previews truncate it.", es: "El título pasa de 60 caracteres. Algunas vistas previas lo cortan." },
  "description-empty": { en: "Description is empty. Previews will fall back to page text.", es: "La descripción está vacía. La vista previa usará texto de la página." },
  "description-long": { en: "Description is over 200 characters.", es: "La descripción pasa de 200 caracteres." },
  "url-absolute": { en: "Page URL must be absolute (https://…).", es: "La URL de la página tiene que ser absoluta (https://…)." },
  "image-absolute": { en: "Image URL must be absolute (https://…).", es: "La URL de la imagen tiene que ser absoluta (https://…)." },
  "image-missing": { en: "summary_large_image expects an image. Tags are still copied.", es: "summary_large_image espera una imagen. Las tags igual se copian." },
  "image-http": { en: "Image is http, not https. Many crawlers drop it.", es: "La imagen es http, no https. Muchos crawlers la descartan." },
};

export function OpenGraphTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [title, setTitle] = useState(EXAMPLE.title);
  const [description, setDescription] = useState(EXAMPLE.description);
  const [url, setUrl] = useState(EXAMPLE.url);
  const [image, setImage] = useState(EXAMPLE.image);
  const [siteName, setSiteName] = useState(EXAMPLE.siteName);
  const [type, setType] = useState<OgType>(EXAMPLE.type);
  const [card, setCard] = useState<TwitterCard>(EXAMPLE.card);
  const [ogLocale, setOgLocale] = useState<OgLocale>(EXAMPLE.locale);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => buildOpenGraph({ title, description, url, image, siteName, type, card, locale: ogLocale }),
    [title, description, url, image, siteName, type, card, ogLocale],
  );

  async function copy() {
    if (!result.html) return;
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTitle(EXAMPLE.title);
    setDescription(EXAMPLE.description);
    setUrl(EXAMPLE.url);
    setImage(EXAMPLE.image);
    setSiteName(EXAMPLE.siteName);
    setType(EXAMPLE.type);
    setCard(EXAMPLE.card);
    setOgLocale(EXAMPLE.locale);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "Título" : "Title"} <span className="text-muted-foreground">({result.titleLength}/60)</span></span>
        <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} aria-label={es ? "Título Open Graph" : "Open Graph title"} />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{es ? "Descripción" : "Description"} <span className="text-muted-foreground">({result.descriptionLength}/200)</span></span>
        <textarea className={fieldClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} aria-label={es ? "Descripción Open Graph" : "Open Graph description"} />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{es ? "URL canónica" : "Canonical URL"}</span>
        <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" aria-label={es ? "URL canónica" : "Canonical URL"} />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{es ? "Imagen absoluta" : "Absolute image URL"}</span>
        <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} inputMode="url" aria-label={es ? "URL de imagen" : "Image URL"} />
      </label>
      <label className="block space-y-1 text-sm">
        <span>{es ? "Nombre del sitio" : "Site name"}</span>
        <input className={fieldClass} value={siteName} onChange={(e) => setSiteName(e.target.value)} aria-label={es ? "Nombre del sitio" : "Site name"} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 text-sm">
          <span>og:type</span>
          <select className={fieldClass} value={type} onChange={(e) => setType(e.target.value as OgType)} aria-label="og:type">
            <option value="website">website</option>
            <option value="article">article</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>twitter:card</span>
          <select className={fieldClass} value={card} onChange={(e) => setCard(e.target.value as TwitterCard)} aria-label="twitter:card">
            <option value="summary_large_image">summary_large_image</option>
            <option value="summary">summary</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>og:locale</span>
          <select className={fieldClass} value={ogLocale} onChange={(e) => setOgLocale(e.target.value as OgLocale)} aria-label="og:locale">
            <option value="en_US">en_US</option>
            <option value="es_ES">es_ES</option>
          </select>
        </label>
      </div>
      {result.issues.length > 0 ? (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {result.issues.map((issue) => (
            <li key={issue.code}>{es ? ISSUE_COPY[issue.code].es : ISSUE_COPY[issue.code].en}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{es ? "Sin avisos. La imagen no se descarga." : "No warnings. The image is not fetched."}</p>
      )}
      <pre className="overflow-x-auto rounded-xl border border-border p-4 text-sm">{result.html || (es ? "Nada para copiar." : "Nothing to copy.")}</pre>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={copy}>{copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar tags" : "Copy tags")}</button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Restablecer" : "Reset"}</button>
      </div>
    </div>
  );
}
