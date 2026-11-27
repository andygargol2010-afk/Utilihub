import { useEffect, useMemo, useState } from "react";
import { embedGames, embedLabel, EMBED_GAME_SLUGS, embedSourcePath, type EmbedLocale, type EmbedTheme } from "@/lib/embed/whitelist";
import { gameSummary } from "@/lib/games/catalog";

const SITE = "https://utilihub.net";

type SizeId = "s" | "m" | "l" | "c";
type SnippetMode = "fixed" | "responsive";
type BadgeStyle = "text" | "button";
const MIN_DIM = 280;
const MAX_DIM = 1200;
const clampDim = (n: number, fallback: number) => (Number.isFinite(n) ? Math.min(MAX_DIM, Math.max(MIN_DIM, Math.round(n))) : fallback);
const SIZES: { id: SizeId; w: number; h: number; en: string; es: string }[] = [
  { id: "s", w: 360, h: 520, en: "Small (360×520)", es: "Pequeño (360×520)" },
  { id: "m", w: 480, h: 640, en: "Medium (480×640)", es: "Mediano (480×640)" },
  { id: "l", w: 640, h: 720, en: "Large (640×720)", es: "Grande (640×720)" },
  { id: "c", w: 480, h: 640, en: "Custom", es: "Personalizado" },
];

function buildEmbedUrl(origin: string, slug: string, lang: EmbedLocale, theme: EmbedTheme) {
  const q = new URLSearchParams();
  if (lang === "es") q.set("lang", "es");
  if (theme === "dark") q.set("theme", "dark");
  const qs = q.toString();
  return `${origin}/embed/${slug}${qs ? `?${qs}` : ""}`;
}

function useCopy() {
  const [done, setDone] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setDone(key);
      window.setTimeout(() => setDone((d) => (d === key ? null : d)), 2000);
    } catch {
      setFailed(true);
      setDone(null);
    }
  };
  return { done, failed, copy };
}

export function EmbedStudio({ locale }: { locale: EmbedLocale }) {
  const es = locale === "es";
  const games = useMemo(() => embedGames(), []);
  const [slug, setSlug] = useState<string>(EMBED_GAME_SLUGS[0]);
  const [sizeId, setSizeId] = useState<SizeId>("m");
  const [theme, setTheme] = useState<EmbedTheme>("light");
  const [lang, setLang] = useState<EmbedLocale>(locale);
  const [cw, setCw] = useState(480);
  const [ch, setCh] = useState(640);
  const [mode, setMode] = useState<SnippetMode>("fixed");
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>("text");
  const [clampNote, setClampNote] = useState("");
  const [origin, setOrigin] = useState(SITE);
  const { done, failed, copy } = useCopy();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
    const p = new URLSearchParams(window.location.search);
    const g = p.get("g");
    if (g && (EMBED_GAME_SLUGS as readonly string[]).includes(g)) setSlug(g);
    const s = p.get("s") as SizeId | null;
    if (s && SIZES.some((x) => x.id === s)) setSizeId(s);
    if (p.get("t") === "dark") setTheme("dark");
    const l = p.get("l");
    if (l === "es" || l === "en") setLang(l);
    if (p.get("w")) setCw(clampDim(Number(p.get("w")), 480));
    if (p.get("h")) setCh(clampDim(Number(p.get("h")), 640));
    if (p.get("m") === "r") setMode("responsive");
    if (p.get("b") === "button") setBadgeStyle("button");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("g", slug);
    url.searchParams.set("s", sizeId);
    url.searchParams.set("t", theme);
    url.searchParams.set("l", lang);
    if (sizeId === "c") {
      url.searchParams.set("w", String(cw));
      url.searchParams.set("h", String(ch));
    } else {
      url.searchParams.delete("w");
      url.searchParams.delete("h");
    }
    if (mode === "responsive") url.searchParams.set("m", "r");
    else url.searchParams.delete("m");
    if (badgeStyle === "button") url.searchParams.set("b", "button");
    else url.searchParams.delete("b");
    window.history.replaceState({}, "", url.toString());
  }, [slug, sizeId, theme, lang, cw, ch, mode, badgeStyle]);

  const game = games.find((g) => g.slug === slug) ?? games[0]!;
  const preset = SIZES.find((s) => s.id === sizeId) ?? SIZES[1]!;
  const size = sizeId === "c" ? { ...preset, w: clampDim(cw, 480), h: clampDim(ch, 640) } : preset;
  const commitDim = (axis: "w" | "h") => {
    const raw = axis === "w" ? cw : ch;
    const fallback = axis === "w" ? 480 : 640;
    const next = clampDim(raw, fallback);
    (axis === "w" ? setCw : setCh)(next);
    setClampNote(
      next !== raw
        ? es
          ? `${axis === "w" ? "Ancho" : "Alto"} ajustado a ${next} píxeles (permitido: ${MIN_DIM} a ${MAX_DIM}).`
          : `${axis === "w" ? "Width" : "Height"} adjusted to ${next} pixels (allowed: ${MIN_DIM} to ${MAX_DIM}).`
        : "",
    );
  };
  const embedUrl = buildEmbedUrl(origin, slug, lang, theme);
  const publicUrl = buildEmbedUrl(SITE, slug, lang, theme);
  const gameUrl = `${SITE}${embedSourcePath(game, lang)}`;
  const title = embedLabel(game, lang);
  const badgeText = lang === "es" ? "Con tecnología de UtiliHub" : "Powered by UtiliHub";
  const badgeHtml =
    badgeStyle === "button"
      ? `<p style="margin:6px 0 0"><a href="${gameUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:6px 12px;border-radius:8px;background:#059669;color:#fff;font:600 12px sans-serif;text-decoration:none">${badgeText}</a></p>`
      : `<p style="font:12px sans-serif"><a href="${gameUrl}" target="_blank" rel="noopener">${badgeText}</a></p>`;
  const iframeSnippet =
    mode === "responsive"
      ? `<div style="position:relative;width:100%;max-width:${size.w}px;aspect-ratio:${size.w} / ${size.h}">\n` +
        `  <iframe src="${publicUrl}" title="${title} — UtiliHub" style="position:absolute;inset:0;width:100%;height:100%;border:0" loading="lazy" allowfullscreen></iframe>\n</div>\n${badgeHtml}`
      : `<iframe src="${publicUrl}" title="${title} — UtiliHub" width="${size.w}" height="${size.h}" ` +
        `style="border:0;max-width:100%" loading="lazy" allowfullscreen></iframe>\n${badgeHtml}`;

  const label = "mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground";
  const field =
    "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";
  const pill = (active: boolean) =>
    `min-h-[44px] rounded-xl border px-3 py-2 text-sm font-semibold motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
      active ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border bg-background hover:bg-muted"
    }`;
  const btn =
    "min-h-[44px] rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <section aria-label={es ? "Configuración" : "Settings"} className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <div>
          <label htmlFor="embed-game" className={label}>
            {es ? "1. Elige un juego" : "1. Pick a game"}
          </label>
          <select id="embed-game" className={field} value={slug} onChange={(e) => setSlug(e.target.value)}>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.emoji} {embedLabel(g, lang)}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted-foreground">{gameSummary(game, lang)}</p>
        </div>

        <fieldset>
          <legend className={label}>{es ? "2. Tamaño" : "2. Size"}</legend>
          <div className="grid gap-2">
            {SIZES.map((s) => (
              <button key={s.id} type="button" aria-pressed={sizeId === s.id} onClick={() => setSizeId(s.id)} className={pill(sizeId === s.id)}>
                {es ? s.es : s.en}
              </button>
            ))}
          </div>
          {sizeId === "c" ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="embed-w" className={label}>
                  {es ? "Ancho (px)" : "Width (px)"}
                </label>
                <input
                  id="embed-w"
                  type="number"
                  inputMode="numeric"
                  min={MIN_DIM}
                  max={MAX_DIM}
                  value={cw}
                  onChange={(e) => setCw(Number(e.target.value))}
                  onBlur={() => commitDim("w")}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="embed-h" className={label}>
                  {es ? "Alto (px)" : "Height (px)"}
                </label>
                <input
                  id="embed-h"
                  type="number"
                  inputMode="numeric"
                  min={MIN_DIM}
                  max={MAX_DIM}
                  value={ch}
                  onChange={(e) => setCh(Number(e.target.value))}
                  onBlur={() => commitDim("h")}
                  className={field}
                />
              </div>
              <p className="col-span-2 text-xs text-muted-foreground">
                {es ? `Entre ${MIN_DIM} y ${MAX_DIM} píxeles.` : `Between ${MIN_DIM} and ${MAX_DIM} pixels.`}
              </p>
              <p role="status" aria-live="polite" className="col-span-2 min-h-[1rem] text-xs font-semibold text-amber-700 dark:text-amber-400">
                {clampNote}
              </p>
            </div>
          ) : null}
        </fieldset>

        <fieldset>
          <legend className={label}>{es ? "3. Tema" : "3. Theme"}</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")} className={pill(theme === "light")}>
              {es ? "Claro" : "Light"}
            </button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} className={pill(theme === "dark")}>
              {es ? "Oscuro" : "Dark"}
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>{es ? "4. Idioma del juego" : "4. Game language"}</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} className={pill(lang === "en")}>
              English
            </button>
            <button type="button" aria-pressed={lang === "es"} onClick={() => setLang("es")} className={pill(lang === "es")}>
              Español
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>{es ? "5. Tipo de código" : "5. Snippet type"}</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={mode === "fixed"} onClick={() => setMode("fixed")} className={pill(mode === "fixed")}>
              {es ? "Tamaño fijo" : "Fixed size"}
            </button>
            <button type="button" aria-pressed={mode === "responsive"} onClick={() => setMode("responsive")} className={pill(mode === "responsive")}>
              {es ? "Adaptable" : "Responsive"}
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>{es ? "6. Estilo de la atribución" : "6. Attribution style"}</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={badgeStyle === "text"} onClick={() => setBadgeStyle("text")} className={pill(badgeStyle === "text")}>
              {es ? "Enlace de texto" : "Text link"}
            </button>
            <button type="button" aria-pressed={badgeStyle === "button"} onClick={() => setBadgeStyle("button")} className={pill(badgeStyle === "button")}>
              {es ? "Botón" : "Button"}
            </button>
          </div>
        </fieldset>
      </section>

      <section aria-label={es ? "Vista previa y código" : "Preview and code"} className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-border bg-muted/40 p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{es ? "Vista previa en vivo" : "Live preview"}</p>
          <div className="overflow-x-auto">
            <iframe
              key={embedUrl}
              src={`/embed/${slug}${embedUrl.includes("?") ? embedUrl.slice(embedUrl.indexOf("?")) : ""}`}
              title={`${title} — ${es ? "vista previa" : "preview"}`}
              width={size.w}
              height={size.h}
              loading="lazy"
              style={{ border: 0, maxWidth: "100%", background: "transparent" }}
              className="mx-auto block rounded-xl"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <label htmlFor="embed-code" className={label}>
            {es ? "Código para pegar (iframe + enlace de atribución)" : "Code to paste (iframe + attribution link)"}
          </label>
          <textarea
            id="embed-code"
            readOnly
            rows={8}
            value={iframeSnippet}
            onFocus={(e) => e.currentTarget.select()}
            className={`${field} font-mono text-xs`}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={() => copy("code", iframeSnippet)}>
              {done === "code" ? (es ? "¡Código copiado!" : "Code copied!") : es ? "Copiar código" : "Copy code"}
            </button>
            <button
              type="button"
              className="min-h-[44px] rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              onClick={() => copy("link", publicUrl)}
            >
              {done === "link" ? (es ? "¡Enlace copiado!" : "Link copied!") : es ? "Copiar enlace" : "Copy link"}
            </button>
          </div>
          <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-xs text-muted-foreground">
            {failed
              ? es
                ? "No se pudo copiar. Selecciona el texto y cópialo manualmente."
                : "Copy failed. Select the text and copy it manually."
              : done
                ? es
                  ? "Copiado al portapapeles."
                  : "Copied to clipboard."
                : ""}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {es
              ? "El juego incluye un enlace visible «Con tecnología de UtiliHub». Por favor, conserva la atribución."
              : "The embed shows a visible “Powered by UtiliHub” link. Please keep the attribution."}
          </p>
        </div>
      </section>
    </div>
  );
}
