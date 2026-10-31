import { useEffect, useMemo, useState } from "react";

type Locale = "en" | "es";

type StyleId = "minimal" | "bold" | "accent";

const STYLES: { id: StyleId; name: { en: string; es: string } }[] = [
  { id: "minimal", name: { en: "Minimal", es: "Minimal" } },
  { id: "bold", name: { en: "Bold", es: "Negrita" } },
  { id: "accent", name: { en: "Accent", es: "Acento" } },
];

const BACKGROUNDS = [
  { id: "slate", label: { en: "Slate", es: "Pizarra" }, css: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", solid: "#0f172a" },
  { id: "indigo", label: { en: "Indigo", es: "Índigo" }, css: "linear-gradient(135deg, #312e81 0%, #4c1d95 100%)", solid: "#312e81" },
  { id: "rose", label: { en: "Rose", es: "Rosa" }, css: "linear-gradient(135deg, #881337 0%, #9f1239 100%)", solid: "#881337" },
  { id: "emerald", label: { en: "Emerald", es: "Esmeralda" }, css: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", solid: "#064e3b" },
  { id: "amber", label: { en: "Amber", es: "Ámbar" }, css: "linear-gradient(135deg, #78350f 0%, #92400e 100%)", solid: "#78350f" },
  { id: "white", label: { en: "White", es: "Blanco" }, css: "#ffffff", solid: "#ffffff" },
] as const;

type BgId = (typeof BACKGROUNDS)[number]["id"];

export function QuoteCardMaker({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [styleId, setStyleId] = useState<StyleId>("minimal");
  const [bgId, setBgId] = useState<BgId>("slate");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const bg = useMemo(() => BACKGROUNDS.find((b) => b.id === bgId) || BACKGROUNDS[0], [bgId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuote(decodeURIComponent(q));
    const a = params.get("a");
    if (a) setAuthor(decodeURIComponent(a));
    const s = params.get("s") as StyleId | null;
    if (s && STYLES.some((x) => x.id === s)) setStyleId(s);
    const bgParam = params.get("bg") as BgId | null;
    if (bgParam && BACKGROUNDS.some((b) => b.id === bgParam)) setBgId(bgParam);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (quote.trim()) url.searchParams.set("q", encodeURIComponent(quote.trim()));
    else url.searchParams.delete("q");
    if (author.trim()) url.searchParams.set("a", encodeURIComponent(author.trim()));
    else url.searchParams.delete("a");
    url.searchParams.set("s", styleId);
    url.searchParams.set("bg", bgId);
    window.history.replaceState({}, "", url.toString());
  }, [quote, author, styleId, bgId]);

  const displayQuote = quote.trim() || (es ? "Tu cita aquí…" : "Your quote here…");
  const displayAuthor = author.trim() ? `— ${author.trim()}` : "";

  const copyText = async () => {
    const text = displayAuthor ? `"${displayQuote}" ${displayAuthor}` : `"${displayQuote}"`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const postToX = () => {
    const text = encodeURIComponent(displayAuthor ? `"${displayQuote}" ${displayAuthor}` : `"${displayQuote}"`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    if (bg.css.startsWith("linear-gradient")) {
      const grd = ctx.createLinearGradient(0, 0, 800, 500);
      if (bg.id === "slate") {
        grd.addColorStop(0, "#0f172a");
        grd.addColorStop(1, "#1e293b");
      } else if (bg.id === "indigo") {
        grd.addColorStop(0, "#312e81");
        grd.addColorStop(1, "#4c1d95");
      } else if (bg.id === "rose") {
        grd.addColorStop(0, "#881337");
        grd.addColorStop(1, "#9f1239");
      } else if (bg.id === "emerald") {
        grd.addColorStop(0, "#064e3b");
        grd.addColorStop(1, "#065f46");
      } else if (bg.id === "amber") {
        grd.addColorStop(0, "#78350f");
        grd.addColorStop(1, "#92400e");
      }
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = bg.solid;
    }
    ctx.fillRect(0, 0, 800, 500);

    // Accent bar for accent style
    if (styleId === "accent") {
      ctx.fillStyle = "#ec4899";
      ctx.fillRect(0, 0, 12, 500);
    }

    // Quote text
    const isLight = bg.id === "white";
    ctx.fillStyle = isLight ? "#0f172a" : "#f8fafc";
    const fontSize = styleId === "bold" ? 32 : 26;
    ctx.font = `${styleId === "bold" ? "bold " : ""}${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    const words = displayQuote.split(" ");
    let line = "";
    let y = 180;
    const maxWidth = 680;
    const lines: string[] = [];
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = test;
      }
    }
    if (line) lines.push(line.trim());
    const startY = 220 - (lines.length * 36) / 2;
    lines.slice(0, 6).forEach((ln, i) => {
      ctx.fillText(ln, 400, startY + i * 40);
    });

    // Author
    if (displayAuthor) {
      ctx.font = "italic 20px system-ui, sans-serif";
      ctx.fillStyle = isLight ? "#475569" : "#cbd5e1";
      ctx.fillText(displayAuthor, 400, startY + lines.length * 40 + 30);
    }

    // Watermark
    ctx.fillStyle = isLight ? "#94a3b8" : "#64748b";
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("utilihub.app", 760, 470);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "quote-card.png";
    a.click();
  };

  const previewStyle: React.CSSProperties = {
    background: bg.css,
    color: bg.id === "white" ? "#0f172a" : "#f8fafc",
    borderLeft: styleId === "accent" ? "6px solid #ec4899" : undefined,
    fontWeight: styleId === "bold" ? 700 : 500,
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="text-sm font-bold">{es ? "Cita" : "Quote"}</label>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder={es ? "Escribe o pega tu cita…" : "Write or paste your quote…"}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-bold">{es ? "Autor (opcional)" : "Author (optional)"}</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={es ? "Nombre del autor" : "Author name"}
          className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold">{es ? "Estilo" : "Style"}</label>
          <select
            value={styleId}
            onChange={(e) => setStyleId(e.target.value as StyleId)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {STYLES.map((s) => (
              <option key={s.id} value={s.id}>{es ? s.name.es : s.name.en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold">{es ? "Fondo" : "Background"}</label>
          <select
            value={bgId}
            onChange={(e) => setBgId(e.target.value as BgId)}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {BACKGROUNDS.map((b) => (
              <option key={b.id} value={b.id}>{es ? b.label.es : b.label.en}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="relative mx-auto flex min-h-[220px] w-full max-w-md flex-col items-center justify-center rounded-2xl p-6 text-center shadow-lg sm:min-h-[260px]"
        style={previewStyle}
      >
        <p className={`text-lg leading-snug sm:text-xl ${styleId === "bold" ? "font-bold" : "font-medium"}`}>
          “{displayQuote}”
        </p>
        {displayAuthor && (
          <p className="mt-4 text-sm italic opacity-80">{displayAuthor}</p>
        )}
        <span className="absolute bottom-3 right-4 text-xs opacity-50">utilihub.app</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyText}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          {copied ? (es ? "¡Copiado!" : "Copied!") : (es ? "Copiar texto" : "Copy text")}
        </button>
        <button
          type="button"
          onClick={postToX}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Publicar en X" : "Post to X"}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {linkCopied ? (es ? "¡Enlace copiado!" : "Link copied!") : (es ? "Copiar enlace" : "Copy link")}
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
        >
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
      </div>
    </div>
  );
}
